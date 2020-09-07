import React, { useState, useEffect } from "react"
import firebase from "./firebase"
// import unsubscribe from "./firebase"
// import "../styles/global.css"

const useItems = () => {
    const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
    useEffect(() => {
      firebase
        .firestore() //access firestore
        .collection("categories") //access "items" collection
        .onSnapshot(snapshot => {
          //You can "listen" to a document with the onSnapshot() method.
          const listCategories = snapshot.docs.map(doc => ({
            //map each document into snapshot
            id: doc.id, //id and data pushed into items array
            ...doc.data() //spread operator merges data to id.
          }));
          setItems(listCategories); //items is equal to listItems
        });
        //called the unsubscribe--closing connection to Firestore.
        // return () => unsubscribe()
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

const CategoryList = () => {
    const listCategory = useItems();
  return (
<table className="item-table">
  <tbody>
    <tr>
      <th className="category">Category</th>
    </tr>
  </tbody>
  {listCategory.map(item => (
        <tbody key={item.id}>
          <tr>
            <td className="resource-name">{item.name}</td>
            <td class="buttons">
                <button>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
            </td>
          </tr>
        </tbody>
      ))}
</table>
)
}
export default CategoryList;