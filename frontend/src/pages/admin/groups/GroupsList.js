import GroupsTable from "./GroupsTable";
import {useContext, useEffect, useState} from "react";
import {AdminContext} from "../context/AdminContext";
import LoadingBackdrop from "../LoadingBackdrop";
import GroupsDialog from "./GroupsDialog";
import axios from "axios";
import api from "../../../components/api/Api";

const GroupsList = () => {

    const {refresh, dialogGroup} = useContext(AdminContext);

    const [groupsList, setGroupsList] = useState(null);
    const [groupsAutocomplete, setGroupsAutocomplete] = useState(null);

    let loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken;

    useEffect(() => {
        axios.post(api.admin + 'get/groups.php').then(({data}) => {
            setGroupsList(data);
        });
    }, [refresh]);

    useEffect(() => {
        axios.post(api.admin + 'groupsAutocomplete.php').then(({data}) => {
            setGroupsAutocomplete(data);
        });
    }, [refresh]);

    return (
        <>
            {groupsList === null || groupsAutocomplete === null ? <LoadingBackdrop/> :
                <>
                    <GroupsTable data={groupsList}/>
                    {dialogGroup ? <GroupsDialog autocomplete={groupsAutocomplete}/> : <></>}
                </>
            }
        </>
    )
}

export default GroupsList;