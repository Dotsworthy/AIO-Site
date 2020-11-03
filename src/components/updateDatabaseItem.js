import React, { useState, useEffect } from "react";

const UpdateDatabaseItem = ( { currentItem }) => {
    
    const [item, setItem] = useState(currentItem)

    const onSubmit = e => {
        e.preventDefault()
        return
    }

    const onChange = e => {
        const { name, value } = e.target
        setItem({ ...item, [name]: value })
      }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" name="name" value={item.name} onChange={onChange} />
                <button type="submit" >Update</button>
            </form>
        </div>
    )
}

export default UpdateDatabaseItem