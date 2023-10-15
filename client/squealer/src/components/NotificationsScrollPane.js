import {useEffect, useState} from "react";
import Notification from "./Notification";
import axios from "axios";
import {getServerDomain} from "../services/Config";
import {getUserPropic} from "../services/AccountManager";
import Squeal, {formatDate} from "./Squeal";
import React from "react";
import Spinner from "./Spinner";
import BackToTop from "./BackToTop";

function NotificationsScrollPane() {
    const [notifications, setNotifications] = useState(null);
    const [key, forceUpdate] = useState(0);

    useEffect(() => {
        async function retrieveNotifications() {
            setNotifications(await loadNotifications());
        }
        retrieveNotifications();
    }, [key])

    async function loadNotifications() {
        try {
            const response = await axios.get(`https://${getServerDomain()}/users/user/notifications`, {withCredentials: true});
            const NotificationsComponents = [];

            for (let entry of response.data) {
                const propic = await getUserPropic(entry.sender);

                NotificationsComponents.push(
                    <Notification
                        key={entry._id}
                        text={entry.text}
                        date={formatDate(entry.date)}
                        title={entry.title}
                        image={propic}
                        id={entry._id}
                        deleteNotification={deleteNotification}
                    />
                );
            }

            return NotificationsComponents;
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteNotification(notificationId) {
        try {
            await axios.post(`https://${getServerDomain()}/users/user/notifications/notification`, {
                id: notificationId
            }, {withCredentials: true}).catch(error => {
                console.log(error.message);
            });
            forceUpdate(currentKey => currentKey + 1);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className='container-fluid vh-100 overflow-y-scroll'>
            <div className='row mt-5 mt-md-0'>
                <div className="anchor" id="notificationTop"/>
                <div className='col-12 mt-5 mt-md-3'>
                    {notifications ? notifications : <Spinner />}
                </div>
                <BackToTop anchorId={'notificationTop'}/>
            </div>
        </div>
    );
}

export default NotificationsScrollPane;