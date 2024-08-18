import { loginSts } from "../../../atom";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {
  deleteUsers,
  getAllUsers,
  updateUserLevel,
} from "../../utilities/users-service";
import Rows from "./Component/Rows";
import LoadingPopup2 from "../../components/LoadingPopup/LoadingPopup2";
import React from "react";

export default function AdminPage() {
  const [currentUser] = useAtomValue(loginSts);
  const [selectedItem, setSelectedItem] = useState({});
  console.log(currentUser);
  const [loadingMsg2, setLoadingMsg2] = useState(false);

  const optionDisplay = Object.keys(selectedItem).length;

  const [userList, setuserList] = useState("");

  useEffect(() => {
    async function getUser() {
      setLoadingMsg2(true);
      const response = await getAllUsers();
      console.log(response);
      setuserList(response);
      setLoadingMsg2(false);
    }
    getUser();
  }, []);

  if (currentUser.usertype !== "admin") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "grey",
        }}
      >
        <b style={{ fontSize: "50px" }}>
          You$aposre unauthorized here!
          <img src="https://img.freepik.com/free-vector/401-error-unauthorized-concept-illustration_114360-1934.jpg" />
        </b>
      </div>
    );
  }

  const handleSelection = (item) => {
    setSelectedItem(item);
  };

  const handlePromotion = async (updatedUserList, user) => {
    setuserList(updatedUserList);
    await updateUserLevel(user);
  };

  const handleDelete = async () => {
    console.log("test");
    console.log(selectedItem);
    const ob1 = [];
    Object.entries(selectedItem).map((entry) => {
      let value = entry[1];
      return ob1.push(value.id);
    });
    const updateList = userList.filter((item) => !ob1.includes(item.id));
    setuserList(updateList);
    setSelectedItem({});
    console.log(ob1);
    const response = await deleteUsers(ob1);
    console.log(response);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          height: "80vh",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <b>User Details</b>
        <div className="overflow-y-auto">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th>User Type</th>
                <th>🌎 HeatMap Points</th>
                <th>🌟 Sign Up Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              <Rows
                userList={userList}
                handleSelection={handleSelection}
                handlePromotion={handlePromotion}
                selectedItem={selectedItem}
              />
            </tbody>
          </table>
        </div>
      </div>

      {loadingMsg2 && <LoadingPopup2 msg={"Admin Page"} />}
      <div>
        {optionDisplay !== 0 && (
          <>
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 
        focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
        dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
