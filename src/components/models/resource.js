
export const addResource = (database, collection, resource) => {
    database.firestore().collection(collection).doc(resource.name).set(resource)
}