import {useSelector} from "react-redux";


export function MentorMainPage() {
    const {user} = useSelector((state) => state.auth.user)
}