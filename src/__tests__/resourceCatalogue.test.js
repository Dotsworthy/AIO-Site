import React from "react";
import { shallow, mount} from "enzyme";
import ItemCatalogue from "../components/itemCatalogue";

import "../setupTests"



describe("itemCatalogue", () => {

    it("renders", () => {
        shallow(<ItemCatalogue/>);
    })

    it("displays six resources", () => {
        const wrapper = shallow(<ItemCatalogue/>)
        expect(wrapper.find(h3)).toHaveLength(6);
    })

})