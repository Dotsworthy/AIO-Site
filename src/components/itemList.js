import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import 'firebase/storage'

const useItems = () => {
    const [items, setItems] = useState([]);
    useEffect(() => {
      firebase
        .firestore()
        .collection("items")
        .onSnapshot(snapshot => {
          const listItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setItems(listItems);
        });
        //called the unsubscribe--closing connection to Firestore.
        // return () => unsubscribe()
    }, []);
    return items;
  };

  const deleteItem = (id, downloadRef) => {
    const storageRef = firebase.storage().ref()
    const imageRef = storageRef.child(downloadRef)
    imageRef.delete().then(function() {
      console.log("resource deleted successfully")
    }).catch(function(error) {
      console.log(error)
    })

    firebase
      .firestore()
      .collection("items")
      .doc(id)
      .delete()
}  

const ItemList = ( { editItem }) => {
    const listItem = useItems();
  return (
    <div>
    <table className="resource-database-table">
      <tbody>
        <tr className="header-row">
          <th className="name">Resource Name</th>
          <th className="description">Description</th>
          <th className="category">Category</th>
          <th className="level">Level</th>
          <th className="tags">Tags</th>
        </tr>
      </tbody>
      {listItem.map(item => (
            <tbody key={item.id}>
              <tr className="data-row">
                <td className="resource-name">{item.name}</td>
                <td className="description">{item.description}</td>
                <td className="category">{item.category}</td>
                <td className="level">{item.level}</td>
                <td className="tags">{item.tags}</td>
                <td className="buttons">
                    <button onClick={() => editItem(item)}>Edit</button>
                    <button onClick={() => deleteItem(item.id, item.download)}>Delete</button>
                </td>
              </tr>
            </tbody>
          ))}
    </table>
    </div>
)}
export default ItemList