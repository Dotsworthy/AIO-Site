import React, { useState, useEffect } from "react";
import firebase from "firebase";
import UpdateSubject from "./updateSubject";
import DeleteSubject from "./deleteSubject";

const DeleteDatabaseItem = ({ setDeleting, currentItem }) => {

    // Resource for deletion
    const item = currentItem;

    const [deletingSubject, setDeletingSubject] = useState(false)
    const [editingSubject, setEditingSubject] = useState(false)
    const [currentSubject, setCurrentSubject] = useState()

    // Looks for resources that contain the selected database item.
    const useItems = () => {
        const [items, setItems] = useState([])
        useEffect(() => {
            if (item.location === "tags") {

                const unsubscribe = firebase
                    .firestore()
                    .collection("subjects")
                    .where(`${item.location}`, "array-contains", `${item.name}`)
                    .onSnapshot(function (snapshot) {
                        const listItems = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                        setItems(listItems)
                    });
                return unsubscribe;
            } else {
                const unsubscribe = firebase
                    .firestore()
                    .collection("subjects")
                    .where(`${item.location}`, "==", `${item.name}`)
                    .onSnapshot(function (snapshot) {
                        const listItems = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                        setItems(listItems)
                    });
                return unsubscribe;
            }
        }, [])
        return items
    }

    // Collects and stores resources that contain the selected database item.
    const resources = useItems();

    const deleteSubject = (e, item) => {
        e.preventDefault();
        setDeletingSubject(true)
        setCurrentSubject({
            id: item.id,
            name: item.name,
            image: item.image,
            description: item.description,
            category: item.category,
            level: item.level,
            tags: item.tags,
            download: item.download
        })
    }

    const editSubject = (e, item) => {
        e.preventDefault();
        setCurrentSubject({
            id: item.id,
            name: item.name,
            image: item.image,
            description: item.description,
            category: item.category,
            level: item.level,
            tags: item.tags,
            download: item.download
        })

        setEditingSubject(true)
    }

    const onSubmit = e => {
        e.preventDefault()
        firebase
            .firestore()
            .collection(`${item.collection}`)
            .doc(item.id)
            .delete()

        setDeleting(false)
    }

    const handleCancel = (e) => {
        e.preventDefault()

        setDeleting(false)
    }

    return (
        <div className="database-container">
            {!deletingSubject && !editingSubject &&


                <form className="small-database-form" onSubmit={onSubmit}>
                    <div className="form-header">
                        <h2>Delete Item</h2>
                    </div>


                    {/* <h2>Delete Item</h2> */}
                    {/* If there are resources in the database with the selected database item, it prevents the user from deleting the resource. */}
                    {resources.length > 0 ?
                        <div className="form-container">
                            <h3>Items attached to resources!</h3>
                            <div className="small-form-content"><p>You cannot delete this database item as it is attached to resources in the database. You must first assign new items to these resources:</p></div>

                            <div className="form-inside-content">
                                {resources.map(resource => {
                                    return <div className="added-item">
                                        <p>{resource.name}</p>
                                        <div className="form-inside-buttons">
                                            <button type="button" onClick={(e) => editSubject(e, resource)}>Edit</button>
                                            <button type="button" onClick={(e) => deleteSubject(e, resource)}>Delete</button>
                                        </div>
                                    </div>
                                })
                                }
                            </div>

                            <button type="reset" onClick={(e) => handleCancel(e)} >Cancel</button>
                        </div>
                        :
                        <div className="form-container">
                            <div className="small-form-content"><p>No resources have this {currentItem.location} attached and can be safely deleted.</p></div>

                            <div className="form-footer">
                                <button onClick={(e) => handleCancel(e)} >Cancel</button>
                                <button type="submit">Delete Item</button>
                            </div>
                        </div>
                    }
                </form>
            }

            {editingSubject && <UpdateSubject setEditing={setEditingSubject} currentItem={currentSubject} />}
            {deletingSubject && <DeleteSubject setDeleting={setDeletingSubject} currentItem={currentSubject} />}

        </div>
    )
}

export default DeleteDatabaseItem