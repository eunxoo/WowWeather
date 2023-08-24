import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { fireStoreJob } from "../../fbase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  orderBy,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const CheckList = ({ userObj }) => {
  const url = "http://localhost:8000";
  const currentDateTime = new Date();
  const hours = currentDateTime.getHours();
  const [rain, setRain] = useState("");
  const [dust, setDust] = useState("");
  const [sdust, setSDust] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const fetchData = (apiEndpoint, lat, lon) => {
    return axios({
      url: url + apiEndpoint,
      method: "post",
      data: { lat: lat, lon: lon },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        console.log(`lat : ${lat}, lon : ${lon}`);

        setLatitude(lat);
        setLongitude(lon);

        Promise.all([
          fetchData("/nowweather", lat, lon, ["T1H", "SKY", "PTY"]),
          fetchData("/nowdust", lat, lon),
        ])
          .then(([nowWeatherRes, nowDustRes]) => {
            const nowPTY = nowWeatherRes.data.find(
              (item) => item.category === "PTY"
            );
            if (nowPTY) {
              setRain(nowPTY.fcstValue);
            }

            const pm25Grade1h = nowDustRes.pm25Grade1h;
            const pm10Grade1h = nowDustRes.pm10Grade1h;
            setDust(pm10Grade1h || "-"); // 만약 null이면 "-"로 설정
            setSDust(pm25Grade1h || "-");

            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    }
  }, []);

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

  const onDeleteClick = async (itemId) => {
    const ok = window.confirm("이 항목을 삭제하겠습니까?");
    if (ok) {
      const itemRef = doc(fireStoreJob, "checklist", itemId);
      await deleteDoc(itemRef);
    }
  };

  return (
    <Container>
      <Wrap rain={rain} hours={hours}>
        <Title>외출 전 체크리스트</Title>
        <Div>
          <Box>
            <FormWrap>
              <InputCheck
                onChange={onChange}
                value={check}
                placeholder="입력해주세요"
                type={"text"}
              />
            </FormWrap>
            <Button onClick={onClick}>+</Button>
          </Box>
        </Div>
        <List>
          <ListItem>
            {list.map((data) => (
              <>
                <input type="checkbox" />
                <Item key={data.id} id={data.id}>
                  {data.check}
                </Item>
                <button onClick={() => onDeleteClick(data.id)}>x</button>
              </>
            ))}
          </ListItem>
        </List>
      </Wrap>
    </Container>
  );
};

export default CheckList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 6vh;
`;

const Wrap = styled.div`
  background: ${({ rain, hours }) => {
    if (rain == 0 && hours >= 4 && hours <= 19) {
      return "linear-gradient(white 3.5%, #b4dfff)";
    } else if (rain !== 0 && hours >= 4 && hours <= 19) {
      return "linear-gradient(white 3.5%, #C6C6C6)";
    } else if ((hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)) {
      return "linear-gradient(black 3.5%, #0B0085)";
    }
  }};
  height: 100vh;
  padding-top: 6vh;
`;

const Title = styled.div``;

const Div = styled.div``;

const Box = styled.div``;

const FormWrap = styled.div``;

const InputCheck = styled.input``;

const Button = styled.button``;

const List = styled.div``;

const ListItem = styled.div`
  color: wheat;
`;

const Item = styled.div``;
