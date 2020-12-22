import React, {useEffect, useState} from "react"
import ResourceCatalogue from "../components/resourceCatalogue"
import Layout from "../components/layout";

// Move Download handler to resource catalogue.

const ResourcePage = () => {

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, [])



    return (
        <Layout siteType={"client"}>

        {hasMounted && <ResourceCatalogue/>} 

        </Layout>
    )
}

export default ResourcePage;