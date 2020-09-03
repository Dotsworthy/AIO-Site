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

const user = {name: "Jackie Robinson", image: "exampleURL", description: "America's first black baseball player", category: "Culture", level: "Key Stage Two", tags: ["United States", "Sport"]}

it("Should get all resources", async function() {

   const resourcesRef = []
    
   admin
   .firestore()
   .collection("items")
   .get()
   .then(function(querySnapshot) {
       querySnapshot.forEach(function(doc) {
        resourcesRef.push(doc.data())  
       })
   })

    await snooz()

    assert.deepStrictEqual(resourcesRef.length, 6)
})

it("Should add a resource", async function() {

    admin.firestore().collection("items").doc("007").set(user)  

    const itemsRef = admin.firestore().collection("items").doc("007")
    const query =  await itemsRef.get();
    
    await snooz();

    assert.deepStrictEqual(query.data().name, "Jackie Robinson");
    
}) 