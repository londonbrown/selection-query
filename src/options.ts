import CreateOptionsPageTask from "./task/CreateOptionsPageTask"

const createOptionsPageTask = new CreateOptionsPageTask()
createOptionsPageTask
  .run()
  .then(() => {
    console.log("CreateOptionsPageTask.run() completed.")
  })
  .catch((reason) => {
    console.error(reason)
  })
  .finally(() => {
    console.log("Finished building HTML from menu items")
  })
