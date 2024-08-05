import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Post/ViewDetail";

const PostPage = () => {
    let location = useLocation();

    let params = new URLSearchParams(location.search);
    const id = params?.get("id");  //post id

    console.log('>>>> check localtion: ', location);
    console.log('>>>> check post id: ', id);


    return (
        <>
            <ViewDetail />
        </>
    )
}

export default PostPage;