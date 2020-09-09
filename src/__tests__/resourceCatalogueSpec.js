import React from "react";
import { shallow, mount } from "enzyme";
import ItemCatalogue from "../components/itemCatalogue"

describe("itemCatalogue", () => {
    
    it("renders", () => {
        shallow(<ItemCatalogue />);
    })

    it("displays six resources", () => {
        const wrapper = mount(<ItemCatalogue />)
        expect(wrapper.find("resource-page-items")).toHaveLength(6);
    })

})