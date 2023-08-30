import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { VscAdd } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { fireStoreJob } from "../../fbase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const ItemList = ({ hours, userObj }) => {
  const [check, setCheck] = useState("");

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setCheck(value);
  };

  const onClick = async () => {
    if (check === "") {
      alert("항목을 입력해주세요");
      return false;
    }

    const checkObj = {
      uid: userObj.uid,
      check: check,
      checked: false,
      createAt: Date.now(),
    };

    await addDoc(collection(fireStoreJob, "checklist"), checkObj);
    setCheck("");
  };

  const [list, setList] = useState([]);

  useEffect(() => {
    const q = query(
      collection(fireStoreJob, "checklist"),
      where("uid", "==", userObj.uid),
      orderBy("createAt", "asc")
    );
    onSnapshot(q, (snapshot) => {
      const checkArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setList(checkArr);
    });
  }, []);
  console.log(list);
  const onDeleteClick = async (itemId) => {
    const ok = window.confirm("이 항목을 삭제하겠습니까?");
    if (ok) {
      const itemRef = doc(fireStoreJob, "checklist", itemId);
      await deleteDoc(itemRef);
    }
  };

  const onCheckedClick = async (itemId, checkedValue) => {
    const itemRef = doc(fireStoreJob, "checklist", itemId);
    if (itemRef) {
      await updateDoc(itemRef, { checked: !checkedValue });
    }
  };

  return (
    <Div>
      <FormWrap>
        <InputThing
          onChange={onChange}
          value={check}
          placeholder="입력하기.."
          type={"text"}
          maxLength={15}
        />
        <VscAddIcon hours={hours}>
          <VscAdd onClick={onClick} />
        </VscAddIcon>
      </FormWrap>
      {list.length > 0 && (
        <List hours={hours}>
          {list.map((data) => (
            <ListItem key={data.id} hours={hours}>
              <StyledLabel>
                <StyledInput
                  type="checkbox"
                  checked={data.checked}
                  onChange={() => {
                    onCheckedClick(data.id, data.checked);
                  }}
                />
                <Item id={data.id}>{data.check}</Item>
              </StyledLabel>
              <MdDelete
                onClick={() => onDeleteClick(data.id)}
                className="deleteIcon"
              />
            </ListItem>
          ))}
          <br />
        </List>
      )}
    </Div>
  );
};

export default ItemList;

const Div = styled.div``;

const FormWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const InputThing = styled.input`
  width: 80vw;
  height: 3vh;
  border: none;
  border-radius: 10px;
  padding: 3vh 1vw;
  font-size: 3vh;
  opacity: 0.8;
`;

const VscAddIcon = styled.div`
  /* position: absolute;
  right: 2vw; */
  height: 3vh;
  padding: 3vh 0;
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
`;

const List = styled.div`
  margin: 2vh 3vw;
  display: flex;
  flex-direction: column;
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.04)";
  }};
  border-radius: 10px;
  padding: 1vh 0;
`;

const ListItem = styled.div`
  position: relative;
  top: 1vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
  padding: 1vh 0;

  .deleteIcon {
    position: absolute;
    font-size: 20px;
    right: 10px;
  }
`;

const Item = styled.div`
  width: 70vw;
  text-align: left;
  margin-left: 10px;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled.input`
  margin-left: 10px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;
  background-color: white;
  transition: background-color 0.3s, border-color 0.3s;

  &:checked {
    border-color: transparent;
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #31b5ff;
  }
`;
