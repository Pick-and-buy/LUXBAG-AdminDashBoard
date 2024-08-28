import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Post/ViewDetail";
import { getPostById } from "../../services/post";

const PostPage = () => {
    const [dataPost, setDataPost] = useState();
    const [isLoading, setIsLoading] = useState(false);

    let location = useLocation();

    let params = new URLSearchParams(location.search);
    const id = params?.get("id");  //post id

    console.log('>>>> check localtion: ', location);

    useEffect(() => {
        fetchPostById(id);
    }, [id]);

    const fetchPostById = async (id) => {
        const res = await getPostById(id);
        if (res && res.result) {
            setDataPost(res.result);
        }
    } 

    return (
        <>
            <ViewDetail dataPost={dataPost}/>
        </>
    )
}

export default PostPage;