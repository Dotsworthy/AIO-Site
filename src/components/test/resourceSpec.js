const firebase = require ('@firebase/testing');
const assert = require("assert");

const projectId = "testproject-85401";
const admin = firebase.initializeAdminApp({ projectId });

async function snooz(time = 500) {
        return new Promise(resolve => {
            setTimeout(e => {
                resolve();
            }, time);
        });
    }

const user1 = {
        name: "Barack Obama",
        image: "exampleURL",
        description: "44th President of the United States",
        category: "Politics",
        level: "Key Stage One",
        tags: ["United States", "Famous People"]
}

it("Should add a resource", async function() {
        
        admin
                .firestore()
                .collection("items")
                .doc("001")
                .set(user1)  

    const itemsRef = admin.firestore().collection("items").doc("001")
    const query =  await itemsRef.get();
    
    await snooz();

    assert.deepStrictEqual(query.data().name, "Barack Obama");
    
}) 