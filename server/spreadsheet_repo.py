from bson.objectid import ObjectId

class SpreadsheetRepo():
  def __init__(self, db):
    self.collection = db['spreadsheets']

  # Since there is only 1 spreadsheet for now ID is ignored
  def get(self, ID):
    return self.collection.find_one()

  def update_cell(self, spreadsheet_id, row, column, new_value, listeners_changeset):
    listeners_update = self._get_listeners_update(spreadsheet_id, listeners_changeset)
    update = {
      "$set": { f"rows.{row - 1}.{column}": new_value, **listeners_update["$set"] },
      "$push": listeners_update["$push"],
      "$pull": listeners_update["$pull"]
    }

    self.collection.update_one({ "_id": ObjectId(spreadsheet_id) }, { k:v for k,v in update.items() if v })

  def _get_listeners_update(self, spreadsheet_id, changeset):
    spreadsheet = self.get(spreadsheet_id)
    update = { "$set": {}, "$push": {}, "$pull": {} }

    if not changeset:
      return update

    for added in changeset["added"]:
      dependency = added.get("dependency", None)
      listener = added.get("listener", None)

      listeners = spreadsheet["_listeners"].get(dependency, None)
      if not listeners:
        update["$set"][f"_listeners.{dependency}"] = [listener]
      elif listener not in listeners:
        update["$push"][f"_listeners.{dependency}"] = listener


    for removed in changeset["removed"]:
      dependency = removed.get("dependency", None)
      listener = removed.get("listener", None)

      listeners = spreadsheet["_listeners"].get(dependency, None)
      if listeners and listener in listeners:
        update["$pull"][f"_listeners.{dependency}"] = listener

    return update


