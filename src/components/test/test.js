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

it("Should add a resource", async function() {

        // const name = {name: "Barack Obama"}
        // const image = {image: "exampleURL"}
        // const description = {description: "44th President of the United States"}
        // const category = {category: "History"}
        // const level = {level: "Key Stage One"}
        // const tags = {tags: "United States"}
        
        admin
                .firestore()
                .collection("items")
                .doc("001")
                .set({
                  name: "Barack Obama",
                  image: "exampleURL",
                  description: "description",
                  category: "category",
                  level: "level",
                  tags: "United States"
                })  

        // result = "Not Barack"


    const itemsRef = admin.firestore().collection("items").doc("001")
    const query =  await itemsRef.get();
    
    await snooz();

    assert.deepStrictEqual(query.data().name, "Barack Obama");
}) 
