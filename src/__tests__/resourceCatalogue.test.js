import React from "react";
import { shallow, mount } from "enzyme";
import ItemCatalogue from "../components/itemCatalogue";
import * as firebase from '@firebase/testing';
import "../setupTests"

const projectId = "testproject-85401";	
// const admin = firebase.initializeAdminApp({ projectId: projectId });

// async function snooz(time = 500) {
//     return new Promise(resolve => {
//         setTimeout(e => {
//             resolve();
//         }, time);
//     });
// }

describe("itemCatalogue", () => {

    it("renders", () => {
        shallow(<ItemCatalogue/>);
    })

    it("displays six resources", () => {
        const wrapper = mount(<ItemCatalogue/>)
        expect(wrapper.find("h3")).toHaveLength(6);
    })

})