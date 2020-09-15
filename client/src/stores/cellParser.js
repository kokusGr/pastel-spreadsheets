import { CellReferenceError } from "./utils";

const cellRegex = /^([A-Za-z]+)(\d+)$/;

// TODO: Use Cell ID? This could be beneficial when adding/removing columns/rows will be implemented
const getCellValue = (cellPosition, spreadsheet) => {
  const match = cellRegex.exec(cellPosition);
  if (!match) {
    throw new CellReferenceError(cellPosition);
  }

  const [, column, rowNumber] = match;
  const cellRow = spreadsheet.getRow(rowNumber);

  if (!cellRow || !spreadsheet.columns.includes(column)) {
    throw new CellReferenceError(cellPosition);
  }

  const cell = cellRow[column];
  return cell ? cell.value : 0;
};

const addResolver = {
  parse(expression) {
    return expression.split("+");
  },

  evaluate(values) {
    return values.reduce((result, value) => result + value, 0);
  },
};

const multiplyResolver = {
  parse(expression) {
    return expression.split("*");
  },
  evaluate(values) {
    return values.reduce((result, value) => result * value, 1);
  },
};

const cellResolver = {
  parse(expression) {
    return expression;
  },
  evaluate(value, context) {
    // NOTE: This assumes that value can only be a number or a cell reference
    const maybeNumber = +value;
    if (Number.isNaN(maybeNumber)) {
      const upperCaseValue = value.toUpperCase().trim();
      if (value === context.cellPosition) {
        throw new CellReferenceError(value);
      }
      const cellValue = getCellValue(upperCaseValue, context.spreadsheet);
      context.addDependency(upperCaseValue);
      return cellValue;
    }

    return value;
  },
};

const defaultResolvers = [addResolver, multiplyResolver, cellResolver];

const resolve = (expression, context, resolvers = defaultResolvers) => {
  const [currentResolver, ...nextResolvers] = resolvers;
  const parts = currentResolver.parse(expression, context);
  const values =
    nextResolvers.length > 0
      ? parts.map((part) => resolve(part, context, nextResolvers))
      : parts;
  return currentResolver.evaluate(values, context);
};

const resolveCellFunction = (rawValue, context) => {
  try {
    const expression = rawValue.slice(1);
    return resolve(expression, context);
  } catch (error) {
    if (error instanceof CellReferenceError) {
      return `#ReferenceError: ${error.cell}`;
    } else {
      throw error;
    }
  }
};

const parseRawValue = (rawValue, context) => {
  if (!rawValue) {
    return "";
  }

  const maybeNumber = +rawValue;
  if (!Number.isNaN(maybeNumber)) {
    return maybeNumber;
  }

  if (typeof rawValue === "string" && rawValue.startsWith("=")) {
    return resolveCellFunction(rawValue, context);
  }

  return "#TypeError";
};

const parseCellValue = (rawValue, cellPosition, spreadsheet) => {
  const dependencies = [];
  const addDependency = (dependency) => {
    dependencies.push(dependency);
  };
  const context = { spreadsheet, addDependency, cellPosition };

  const value = parseRawValue(rawValue, context);
  return { value, dependencies };
};

export { parseCellValue, cellRegex };
