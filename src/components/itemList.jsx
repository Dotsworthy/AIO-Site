import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import unsubscribe from "./firebase"
// import "../styles/global.css"

const useItems = () => {
    const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
    useEffect(() => {
      firebase
        .firestore() //access firestore
        .collection("items") //access "items" collection
        .onSnapshot(snapshot => {
          //You can "listen" to a document with the onSnapshot() method.
          const listItems = snapshot.docs.map(doc => ({
            //map each document into snapshot
            id: doc.id, //id and data pushed into items array
            ...doc.data() //spread operator merges data to id.
          }));
          setItems(listItems); //items is equal to listItems
        });
        //called the unsubscribe--closing connection to Firestore.
        return () => unsubscribe()
    }, []);
    return items;
  };

  const deleteItem = (id) => {
    firebase
      .firestore()
      .collection("items")
      .doc(id)
      .delete()
}  

const ItemList = ( { editItem }) => {
    const listItem = useItems();
  return (
<table className="item-table">
  <tbody>
    <tr>
      <th className="name">Resource Name</th>
      <th className="image">Image</th>
      <th className="description">Description</th>
      <th className="category">Category</th>
      <th className="level">Level</th>
      <th className="tags">Tags</th>
    </tr>
  </tbody>
  {listItem.map(item => (
        <tbody key={item.id}>
          <tr>
            <td className="name">{item.name}</td>
            <td className="image">{item.image}</td>
            <td className="description">{item.description}</td>
            <td className="category">{item.category}</td>
            <td className="level">{item.level}</td>
            <td className="tags">{item.tags}</td>
            <td class="buttons">
                <button onClick={() => editItem(item)}>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
            </td>
          </tr>
        </tbody>
      ))}
</table>
)
}
export default ItemList