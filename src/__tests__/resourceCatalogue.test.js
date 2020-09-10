import React from "react";
import { shallow, mount } from "enzyme";
import ItemCatalogue from "../components/itemCatalogue";
import * as firebase from '@firebase/testing';
import "../setupTests"

const projectId = "testproject-85401";	
const admin = firebase.initializeAdminApp({ projectId: projectId });


describe("itemCatalogue", () => {

    it("renders", () => {
        shallow(<ItemCatalogue db={admin}/>);
    })

    it("displays six resources", () => {
        const wrapper = mount(<ItemCatalogue db={admin}/>)
        expect(wrapper.find("resource-page-items")).toHaveLength(6);
    })

})