import { useLocation } from "react-router-dom";

const PostPage = () => {
    let location = useLocation();

    let params = new URLSearchParams(location.search);
    const id = params?.get("id");  //post id

    console.log('>>>> check post id: ', id);
    

    return (
        <>Post Page</>
    )
}

export default PostPage;