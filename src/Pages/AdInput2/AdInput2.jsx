import { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
//import defaultLogo from "../../assets/defaultlogo.png";
import {
  times,
  occupations,
  employTypes,
  headCounts,
  workPeriods,
  insurances,
  vacations,
  incentives,
  supports,
  treats,
  conditions,
  genders,
  educations,
  applyRoutes,
  phoneNums,
  grades,
} from "../../Data/Data";

import { modules, formats } from "../../Data/EditorModule";

import {
  uploadFile,
  escapeHTML,
  unescapeHTML,
  api,
  deleteFile,
  useLogout,
} from "../../Api/Api";

import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";

import { ko } from "react-day-picker/locale";

import dayjs from "dayjs";
import Modal from "../../Components/Modal";
import Editor from "../../Components/Editor";
import UploadImg from "../../Components/UploadImg";
import MultipleUploadImg from "../../Components/MultipleUploadImg";
import PopupDom from "../../Api/Kakao/PopupDom";
import PopupPostCode from "../../Api/Kakao/PopupPostCode";
import DetailUploadImg from "../../Components/DetailUploadImg";

function AdInput2() {
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  const noUse = false;
  const applyRef = useRef();
  const defaultClassNames = getDefaultClassNames();
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const aid = parsed.aid || "";
  const reinput = parsed.reinput || "n";
  const [beforeData, setBeforeData] = useState(null);
  const [adStat, setAdStat] = useState("등록");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("작업 중...");
  const [title, setTitle] = useState(""); //제목
  const [occupation, setOccupation] = useState([]); //업직종
  const [employType, setEmployType] = useState([]); //고용형태
  const [headCountA, setHeadCountA] = useState(""); //모집인원 (선택형)
  const [headCountB, setHeadCountB] = useState(""); //모집인원 (직접입력)
  const [period, setPeriod] = useState(""); //근무기간
  const [probation, setProbation] = useState(false); //기간협의여부
  const [periodDiscussion, setPeriodDiscussion] = useState(false); //수습기간여부
  const [workDate, setWorkDate] = useState(false); //근무요일 협의여부 false=협의 true=지정
  const [workDateList, setWorkDateList] = useState([]); //근무요일 선택(월~일)
  const [workDateDetail, setWorkDateDetail] = useState(""); //근무요일 상세(참고사항)
  const [workTime, setWorkTime] = useState(false); //근무시간 협의여부 false=협의 true=지정
  const [startTime, setStartTime] = useState("10:00"); //근무 시작시간
  const [endTime, setEndTime] = useState("18:00"); //근무 종료시간
  const [workTimeDetail, setWorkTimeDetail] = useState(""); //근무시간 상세(참고사항)
  const [restTime, setRestTime] = useState(""); //근무시간 상세(참고사항)
  const [rest, setRest] = useState("분");
  const [workTimePeriod, setWorkTimePeriod] = useState("0"); //근무시간 기간(일일 근무시간 계산)
  const [isNightWork, setIsNightWork] = useState(false); //야간근무여부(익일 새벽까지 근무할 때 시간 계산하기 위한 변수)

  const [payType, setPayType] = useState("월급"); //급여 종류(시급 ~ 연봉)
  const [salary, setSalary] = useState(""); //급여 금액(입력용)
  const [formattedSalary, setFormatedSalary] = useState(""); //급여 금액(쉼표 추가)

  const [insurance, setInsurance] = useState([]); //4대보험
  const [vacation, setVacation] = useState([]); //휴가
  const [incentive, setIncentive] = useState([]); //수당
  const [support, setSupport] = useState([]); //기타지원
  const [treat, setTreat] = useState([]); //우대조건
  const [condition, setCondition] = useState([]); //기타조건

  const [gender, setGender] = useState("성별무관"); //성별

  const [age, setAge] = useState(false); //나이조건 false=무관 true=지정
  const [minAge, setMinAge] = useState(""); //최소나이(age=true일때 설정 가능)
  const [maxAge, setMaxAge] = useState(""); //최고나이(age=true일때 설정 가능)

  const [education, setEducation] = useState(""); //학력

  const [limit, setLimit] = useState(false); //마감일 지정여부
  const [limitDate, setLimitDate] = useState(""); //마감일 지정

  const [applyRoute, setApplyRoute] = useState([]); // 지원방법
  const [applyUrl, setApplyUrl] = useState(""); // 기업바로지원 URL

  const [companyName, setCompanyName] = useState(""); // 근무 회사명

  const [zipCode, setZipCode] = useState(""); //우편번호
  const [addressA, setAddressA] = useState(""); //기본주소
  const [addressB, setAddressB] = useState(""); //상세주소
  const [locationX, setLocationX] = useState(0);
  const [locationY, setLocationY] = useState(0);

  const [modalOn, setModalOn] = useState(false); //모달창 오픈 설정
  const [modalType, setModalType] = useState("0"); //모달창 종류 설정

  const [university, setUniversity] = useState(""); //주변대학교
  const [universityShow, setUniversityShow] = useState("선택"); //주변대학교

  const [station, setStation] = useState([]);

  //공고 모집지역
  const [areaCount, setAreaCount] = useState(1);

  const [areaA, setAreaA] = useState({
    sido: "",
    sigugun: "",
    dongEubMyun: "",
  });
  const [areaB, setAreaB] = useState({
    sido: "",
    sigugun: "",
    dongEubMyun: "",
  });
  const [areaC, setAreaC] = useState({
    sido: "",
    sigugun: "",
    dongEubMyun: "",
  });

  const [logoImg, setLogoImg] = useState(""); // 로고 url

  const [photoList, setPhotoList] = useState([]); //사무실사진
  const [beforePhotoList, setBeforePhotoList] = useState([]); //사무실사진

  useEffect(() => {
    console.log(beforePhotoList.length);
  }, [beforePhotoList]);

  const [detailImages, setDetailImages] = useState([]);
  const [uploadedImgs, setUploadedImgs] = useState([]);

  const [managerName, setManagerName] = useState(""); //담당자명
  const [emailId, setEmailId] = useState(""); //담당자이름

  const [contact, setContact] = useState({
    // 연락처 1
    first: "",
    second: "",
    third: "",
    reveal: false,
  });

  const [subContact, setSubContact] = useState({
    // 연락처 2
    first: "",
    second: "",
    third: "",
    reveal: false,
  });
  const [addContact, setAddContact] = useState(false); //추가 연락처 사용여부 (true=사용, false=비사용)

  const [adImg, setAdImg] = useState("");
  const [imgApply, setImgApply] = useState(false);
  const [adPosition, setAdPosition] = useState("Up");

  const [detailContent, setDetailContent] = useState(""); // 상세내용

  const [reserve, setReserve] = useState(false); //광고 등록 예약 여부
  const [reserveDate, setReserveDate] = useState(""); // 광고 등록 예약 날짜

  const [grade, setGrade] = useState("0");
  const [focus, setFocus] = useState(false);

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isHtml, setIsHtml] = useState(false);

  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    getJobData(aid);
    //eslint-disable-next-line
  }, [thisLocation]);

  const getJobData = async aid => {
    setLoading(true);
    setLoadMsg("데이터 불러오는 중...");
    if (!aid) {
      setAdStat("등록");
    } else {
      if (reinput === "y") {
        setAdStat("재등록");
      } else {
        setAdStat("수정");
      }
      const data = {
        aid: aid,
      };
      const res = await api
        .post("/api/v1/formMail_ad/findOneAd", { json: data })
        .json();

      if (res.code === "E403") {
        logout();
        return alert("유효기간이 경과했습니다 다시 로그인 해주세요");
      }
      console.log(res.fmAdList[0]);
      await putData(res.fmAdList[0]);
    }
    setLoading(false);
    setLoadMsg("작업 중...");
  };
  useEffect(() => {
    console.log(beforeData);
  }, [beforeData]);
  const logout = useLogout();
  // 데이터 불러오기
  const putData = async adInfo => {
    setBeforeData(adInfo);
    setBeforePhotoList(adInfo.photoList ? adInfo.photoList.split(",") : []);
    setZipCode(adInfo.zipCode);
    setAddressA(adInfo.address);
    await getLocation(adInfo.address);
    if (adInfo.addressDetail) {
      setAddressB(adInfo.addressDetail);
    }
    setTitle(adInfo.title);
    setOccupation(adInfo.jobType.split(","));
    setEmployType(adInfo.employmentType.split(","));
    if (headCounts.includes(adInfo.recruitCount)) {
      setHeadCountA(adInfo.recruitCount);
    } else {
      setHeadCountA("직접입력");
      setHeadCountB(adInfo.recruitCount);
    }
    await splitPhone(adInfo.managerPhone, adInfo.phoneShow, 1);
    if (adInfo.managerSubPhone) {
      setAddContact(true);
      await splitPhone(adInfo.managerSubPhone, adInfo.subPhoneShow, 2);
    }
    if (adInfo.welfare.length > 0) {
      await putWelfare(adInfo.welfare);
    }
    if (adInfo.preConditions.length > 0) {
      setTreat(adInfo.preConditions.split(","));
    }
    if (adInfo.etcConditions.length > 0) {
      setCondition(adInfo.etcConditions.split(","));
    }
    setGender(adInfo.gender);
    setAge(adInfo.age);
    setMaxAge(adInfo.maxAge);
    setMinAge(adInfo.minAge);
    setPeriod(adInfo.workPeriod);
    setProbation(adInfo.probation);
    setPeriodDiscussion(adInfo.periodDiscussion);
    setWorkDate(adInfo.workDate);
    if (adInfo.workDate) {
      setWorkDateList(adInfo.workDays.split(","));
    }
    setWorkTime(adInfo.workTime);
    if (adInfo.workTime) {
      setStartTime(adInfo.workStart || "");
      setEndTime(adInfo.workEnd || "");
    }
    setWorkTimeDetail(adInfo.workTimeDetail);
    setPayType(adInfo.salaryType);
    setSalary(Number(adInfo.salary).toLocaleString());
    setFormatedSalary(adInfo.salary);
    setEducation(adInfo.education);
    if (reinput === "y") {
      setLimit("상시모집");
      setLimitDate("");
    } else {
      setLimit(adInfo.endLimit ? "마감일지정" : "상시모집");
      setLimitDate(adInfo.endDate || "");
    }
    setApplyRoute(adInfo.applyMethod.split(","));
    setApplyUrl(adInfo.applyUrl || "");
    setCompanyName(adInfo.company); // 회사명 불러오기
    setAreaA({
      sido: adInfo.sido || "",
      sigungu: adInfo.sigungu || "",
      dongEubMyun: adInfo.dongEubMyun || "",
    });
    setAreaB({
      sido: adInfo.sido2 || "",
      sigungu: adInfo.sigungu2 || "",
      dongEubMyun: adInfo.dongEubMyun2 || "",
    });
    setAreaC({
      sido: adInfo.sido3 || "",
      sigungu: adInfo.sigungu3 || "",
      dongEubMyun: adInfo.dongEubMyun3 || "",
    });
    if (adInfo.sido3) {
      setAreaCount(3);
    } else if (adInfo.sido2) {
      setAreaCount(2);
    } else {
      setAreaCount(1);
    }
    setEmailId(adInfo.managerEmail || "");
    setManagerName(adInfo.managerName || "");
    setCompanyName(adInfo.company || "");
    setDetailContent(
      adInfo.detailContent ? unescapeHTML(adInfo.detailContent) : ""
    );
    setUploadedImgs(adInfo.deatilImages || []);

    setGrade(String(adInfo.grade));
    setFocus(adInfo.focus);
    const reserveDay = dayjs(adInfo.startDate).format("YYMMDD");
    const today = dayjs(new Date()).format("YYMMDD");
    console.log(Number(reserveDay) > Number(today));
    setReserve(Number(reserveDay) > Number(today));
    if (Number(reserveDay) > Number(today)) {
      setReserveDate(adInfo.startDate);
    }
    setManagerName(
      adInfo.userName
        ? adInfo.userName
        : adInfo.managerName
        ? adInfo.managerName
        : ""
    );
  };

  const putWelfare = async welfare => {
    const list = welfare.split(",");
    const insurance = [];
    const vacation = [];
    const incentive = [];
    const support = [];
    list.forEach(item => {
      if (insurances.includes(item)) {
        insurance.push(item);
      }
      if (vacations.includes(item)) {
        vacation.push(item);
      }
      if (incentives.includes(item)) {
        incentive.push(item);
      }
      if (supports.includes(item)) {
        support.push(item);
      }
    });
    setInsurance(insurance);
    setVacation(vacation);
    setIncentive(incentive);
    setSupport(support);
  };
  const splitPhone = async (num, show, count) => {
    let first = "";
    let second = "";
    let third = "";

    if (num.startsWith("02")) {
      first = num.slice(0, 2); // 시작 2글자
    } else if (num.startsWith("050")) {
      first = num.slice(0, 4); // 시작 4글자
    } else {
      first = num.slice(0, 3); // 기본 3글자
    }

    third = num.slice(-4); // 맨 끝 4글자
    second = num.slice(first.length, -4); // 중간 숫자들
    if (count === 1) {
      setContact({
        first: first,
        second: second,
        third: third,
        reveal: show,
      });
    } else if (count === 2) {
      setSubContact({
        first: first,
        second: second,
        third: third,
        reveal: show,
      });
    }
  };

  //모달 스크롤 막기
  useEffect(() => {
    if (modalOn || isPopupOpen) {
      // 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 스크롤 복원
      document.body.style.overflow = "";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOn, isPopupOpen]);

  //좌표정보
  useEffect(() => {
    if (addressA) getLocation(addressA);
    //eslint-disable-next-line
  }, [addressA]);

  const getSubwayUniversity = async (x, y) => {
    const res = await api
      .get(`/api/v1/common/find/subway?x=${x}&y=${y}`)
      .json();

    setUniversity(res.university);
    let stations = [];
    if (res.mapInfoList.length > 0) {
      for (const item of res.mapInfoList) {
        const nearStation = item.subway;
        const line = item.line;
        const distance = item.distance;
        const durationTime = item.durationTime;
        const subwayColor = item.subwayColor;
        stations.push({
          nearStation,
          line,
          distance,
          durationTime,
          subwayColor,
          show: true,
        });
      }
    }
    setStation(stations);
  };

  const getLocation = async address => {
    const res = await api
      .get(`/api/v1/common/get/coordinates?address=${address}`)
      .json();
    console.log(res);
    setLocationX(res.x);
    setLocationY(res.y);
    await getSubwayUniversity(res.x, res.y);
  };
  //지원경로로 이동
  const scrollToApply = () => {
    if (applyRef.current) {
      const offsetTop =
        applyRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop - 120, // 실제 위치에서 120px 보정
        behavior: "smooth",
      });
    }
  };
  const handleManagerName = e => {
    const value = e.target.value;
    if (value.length <= 20) {
      setManagerName(value);
    } else {
      return alert("글자수는 40자를 초과할 수 없습니다");
    }
  };

  const handleRestTime = e => {
    const value = e.target.value;
    // 숫자만 입력받도록 정규식을 사용하여 필터링
    if (/^\d*$/.test(value)) {
      setRestTime(value); // 숫자인 경우만 상태를 업데이트
    }
  };

  const handleEmail = e => {
    const value = e.target.value;
    setEmailId(value);
  };

  const handleContactChange = (field, value, type) => {
    if (type === "Main") {
      setContact(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    if (type === "Sub") {
      setSubContact(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleContactCheckChange = (field, e, type) => {
    const value = e.target.checked;
    if (type === "Main") {
      setContact(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    if (type === "Sub") {
      setSubContact(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addArea = () => {
    if (areaCount < 3) {
      setAreaCount(areaCount + 1);
    } else {
      alert("공고 노출지역은 최대 3개까지 선택 가능합니다");
    }
  };

  const chkEmail = email => {
    // 정규식: 이메일 형식 검사
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;
    return emailRegex.test(email);
  };

  const deleteArea = count => {
    if (areaCount > 1) {
      setAreaCount(areaCount - 1);
      if (count === "B") {
        setAreaB({
          sido: "",
          sigugun: "",
          dongEubMyun: "",
        });
      }
      if (count === "C") {
        setAreaC({
          sido: "",
          sigugun: "",
          dongEubMyun: "",
        });
      }
    } else {
      if (count === "A") {
        setAreaA({
          sido: "",
          sigugun: "",
          dongEubMyun: "",
        });
      }
    }
  };

  const handleCompanyNameChange = e => {
    const value = e.target.value;
    if (value.length <= 40) {
      setCompanyName(value);
    } else {
      return alert("글자수는 40자를 초과할 수 없습니다");
    }
  };

  const handleLimitChange = e => {
    setLimit(e.target.value);
    if (e.target.value === "상시모집") {
      setLimitDate("");
    }
  };

  const handleStationChange = (idx, value) => {
    setStation(prevStations =>
      prevStations.map(
        (stat, i) =>
          i === idx
            ? { ...stat, show: value } // 선택된 index의 show를 업데이트
            : stat // 나머지는 그대로 유지
      )
    );
  };

  const handleUniversityChange = e => {
    setUniversityShow(e.target.value);
  };

  const handleWorkday = event => {
    const { value, checked } = event.target;

    if (checked) {
      // 체크된 경우 배열에 추가하고 숫자로 변환해서 정렬
      setWorkDateList(prevSelected => {
        const updatedWorkDays = [...prevSelected, value].sort(
          (a, b) => parseInt(a, 10) - parseInt(b, 10)
        ); // 숫자로 변환해 정렬
        return updatedWorkDays;
      });
    } else {
      // 체크 해제된 경우 배열에서 값만 삭제
      setWorkDateList(prevSelected => {
        return prevSelected.filter(item => item !== value);
      });
    }
  };

  const handleInsuranceChange = event => {
    const { value, checked } = event.target;

    if (checked) {
      // 체크된 경우 배열에 추가하고 숫자로 변환해서 정렬
      setInsurance(prevSelected => {
        const updatedWorkDays = [...prevSelected, value].sort(
          (a, b) => parseInt(a, 10) - parseInt(b, 10)
        ); // 숫자로 변환해 정렬
        return updatedWorkDays;
      });
    } else {
      // 체크 해제된 경우 배열에서 값만 삭제
      setInsurance(prevSelected => {
        return prevSelected.filter(item => item !== value);
      });
    }
  };

  const handleVacationChange = event => {
    const { value, checked } = event.target;

    if (checked) {
      // 체크된 경우 배열에 추가하고 숫자로 변환해서 정렬
      setVacation(prevSelected => {
        const updatedWorkDays = [...prevSelected, value].sort(
          (a, b) => parseInt(a, 10) - parseInt(b, 10)
        ); // 숫자로 변환해 정렬
        return updatedWorkDays;
      });
    } else {
      // 체크 해제된 경우 배열에서 값만 삭제
      setVacation(prevSelected => {
        return prevSelected.filter(item => item !== value);
      });
    }
  };

  const handleIncentiveChange = event => {
    const { value, checked } = event.target;

    if (checked) {
      // 체크된 경우 배열에 추가하고 숫자로 변환해서 정렬
      setIncentive(prevSelected => {
        const updatedWorkDays = [...prevSelected, value].sort(
          (a, b) => parseInt(a, 10) - parseInt(b, 10)
        ); // 숫자로 변환해 정렬
        return updatedWorkDays;
      });
    } else {
      // 체크 해제된 경우 배열에서 값만 삭제
      setIncentive(prevSelected => {
        return prevSelected.filter(item => item !== value);
      });
    }
  };

  const handleSupportChange = event => {
    const { value, checked } = event.target;

    if (checked) {
      // 체크된 경우 배열에 추가하고 숫자로 변환해서 정렬
      setSupport(prevSelected => {
        const updatedWorkDays = [...prevSelected, value].sort(
          (a, b) => parseInt(a, 10) - parseInt(b, 10)
        ); // 숫자로 변환해 정렬
        return updatedWorkDays;
      });
    } else {
      // 체크 해제된 경우 배열에서 값만 삭제
      setSupport(prevSelected => {
        return prevSelected.filter(item => item !== value);
      });
    }
  };

  const handleTreatChange = event => {
    const { value, checked } = event.target;

    if (checked) {
      // 체크된 경우 배열에 추가하고 숫자로 변환해서 정렬
      setTreat(prevSelected => {
        const updatedWorkDays = [...prevSelected, value].sort(
          (a, b) => parseInt(a, 10) - parseInt(b, 10)
        ); // 숫자로 변환해 정렬
        return updatedWorkDays;
      });
    } else {
      // 체크 해제된 경우 배열에서 값만 삭제
      setTreat(prevSelected => {
        return prevSelected.filter(item => item !== value);
      });
    }
  };

  const handleConditionChange = event => {
    const { value, checked } = event.target;

    if (checked) {
      // 체크된 경우 배열에 추가하고 숫자로 변환해서 정렬
      setCondition(prevSelected => {
        const updatedWorkDays = [...prevSelected, value].sort(
          (a, b) => parseInt(a, 10) - parseInt(b, 10)
        ); // 숫자로 변환해 정렬
        return updatedWorkDays;
      });
    } else {
      // 체크 해제된 경우 배열에서 값만 삭제
      setCondition(prevSelected => {
        return prevSelected.filter(item => item !== value);
      });
    }
  };

  useEffect(() => {
    console.log(dayjs(limitDate).format("2025MMDD"));

    const todayNum = Number(dayjs(new Date()).format("YYYYMMDD"));
    const selectedNum = Number(dayjs(limitDate).format("2025MMDD"));
    console.log(selectedNum);
    if (selectedNum <= todayNum) {
      alert("마감일은 오늘 이후로 지정하세요");
      setLimitDate("");
    }
  }, [limitDate]);

  useEffect(() => {
    if (startTime && endTime) {
      const startHour = Number(startTime.split(":")[0]);
      const startMin = Number(startTime.split(":")[1]);
      const endHour = Number(endTime.split(":")[0]);
      const endMin = Number(endTime.split(":")[1]);
      if (startHour < endHour) {
        setIsNightWork(false);
        if (startMin === endMin) {
          setWorkTimePeriod(`${endHour - startHour}시간`);
        } else if (startMin < endMin) {
          setWorkTimePeriod(`${endHour - startHour}시간 30분`);
        } else {
          setWorkTimePeriod(`${endHour - startHour - 1}시간 30분`);
        }
      } else if (startHour > endHour) {
        setIsNightWork(true);
        if (startMin === endMin) {
          setWorkTimePeriod(`${endHour + 24 - startHour}시간`);
        } else if (startMin < endMin) {
          setWorkTimePeriod(`${endHour + 24 - startHour}시간 30분`);
        } else {
          setWorkTimePeriod(`${endHour + 24 - startHour - 1}시간 30분`);
        }
      } else {
        if (startMin === endMin) {
          alert("시작시간과 종료시간은 동일할 수 없습니다");
          setIsNightWork(false);
          setStartTime("");
          setEndTime("");
          setWorkTimePeriod("");
        } else if (startMin < endMin) {
          setIsNightWork(false);
          setWorkTimePeriod(`30분`);
        } else {
          setIsNightWork(true);
          setWorkTimePeriod(`23시간 30분`);
        }
      }
    } else {
      setWorkTimePeriod("");
    }
  }, [startTime, endTime]);

  const handleTitle = e => {
    const value = e.target.value;
    if (value.length <= 60) {
      setTitle(value);
    } else {
      return alert("글자수는 40자를 초과할 수 없습니다");
    }
  };

  const handleOccupationChange = e => {
    const { value, checked } = e.target;
    if (checked) {
      // 다른 값은 배열에 추가
      setOccupation(prev => [...prev.filter(item => item !== "e"), value]);
    } else {
      // 체크 해제 시 배열에서 제거
      setOccupation(prev => prev.filter(item => item !== value));
      if (value === "기업바로지원") {
        setApplyUrl("");
      }
    }
  };

  const handleGenderChange = e => {
    setGender(e.target.value); // 선택된 값으로 상태 업데이트
  };

  const handlePeriodChange = e => {
    setPeriod(e.target.value); // 선택된 값으로 상태 업데이트
  };

  const handleGradeChange = e => {
    setGrade(e.target.value); // 선택된 값으로 상태 업데이트
  };

  const handlePeriodDiscussionChange = event => {
    setPeriodDiscussion(event.target.checked); // 체크박스 상태 업데이트
  };

  const handleProbationChange = event => {
    setProbation(event.target.checked); // 체크박스 상태 업데이트
  };

  const handleFocusChange = event => {
    setFocus(event.target.checked); // 체크박스 상태 업데이트
  };

  const handleEmployTypeChange = e => {
    const { value, checked } = e.target;

    if (value === "교육생/연수생") {
      // '교육생/연수생'을 체크하면 배열 초기화 후 '교육생/연수생' 추가
      if (checked) {
        setEmployType(["교육생/연수생"]);
      } else {
        setEmployType([]); // 체크 해제 시 배열 초기화
      }
    } else {
      if (checked) {
        // 다른 값을 체크하면 '교육생/연수생' 제거 후 추가
        setEmployType(prev => [
          ...prev.filter(item => item !== "교육생/연수생"),
          value,
        ]);
      } else {
        // 체크 해제 시 해당 값만 배열에서 제거
        setEmployType(prev => prev.filter(item => item !== value));
      }
    }
  };

  /* 백업
  const handleEmployTypeChange = e => {
    const { value, checked } = e.target;
    if (value === "교육생/연수생") {
      // 'e'를 체크하면 배열 초기화 후 'e' 추가
      if (checked) {
        setEmployType(["교육생/연수생"]);
      } else {
        setEmployType([]); // 'e' 체크 해제 시 배열 초기화
      }
    } else {
      if (checked) {
        // 다른 값은 배열에 추가
        setEmployType(prev => [...prev.filter(item => item !== "e"), value]);
      } else {
        // 체크 해제 시 배열에서 제거
        setEmployType(prev => prev.filter(item => item !== value));
      }
    }
  };
  */

  const handleApplyRouteChange = e => {
    const { value, checked } = e.target;
    if (checked) {
      // 다른 값은 배열에 추가
      setApplyRoute(prev => [...prev.filter(item => item !== "e"), value]);
    } else {
      // 체크 해제 시 배열에서 제거
      setApplyRoute(prev => prev.filter(item => item !== value));
      if (value === "기업바로지원") {
        setApplyUrl("");
      }
    }
  };

  const handleHeadCountChange = e => {
    setHeadCountA(e.target.value); // 선택된 값으로 상태 업데이트
    if (e.target.value !== "기타") {
      setHeadCountB("");
    }
  };

  const reset = () => {
    console.log("초기화");
  };

  const handleLoading = (loading, message) => {
    setLoading(loading);
    setLoadMsg(message || "작업 중...");
  };

  const submit = async repeat => {
    const confirm = window.confirm(
      adStat !== "수정"
        ? "공고 등록을 하면 예약한 날짜부터 바로 공개됩니다. 진행할까요?"
        : "수정을 진행하면 이전 내용을 완전히 덮어쓰게 됩니다. 진행할까요?"
    );

    if (!confirm) return;

    handleLoading(true, "저장 중...");

    let data = null; // 데이터 초기화
    try {
      const response = await getData();
      data = response.data; // 성공적으로 가져온 데이터 저장
      const { result } = response;

      if (result !== "성공") {
        handleLoading(false);
        return alert(result);
      }

      const apiUrl =
        adStat === "수정"
          ? "/api/v1/formMail_ad/updateAd"
          : "/api/v1/formMail_ad/addAd";

      if (adStat === "수정") data.aid = aid;
      console.log(data);
      const res = await api[adStat === "수정" ? "put" : "post"](apiUrl, {
        json: data,
      }).json();

      if (res.code === "C000") {
        alert("완료");
        if (repeat !== "repeat") {
          navi("/admin/adlist");
        } else {
          window.scrollTo({
            top: 0, // 맨 위로 이동
            left: 0, // 수평 위치 (왼쪽)
            behavior: "smooth", // 부드러운 스크롤
          });
          window.location.reload();
        }
      } else {
        if (res.code === "E403") {
          logout();
          return alert("유효기간이 경과했습니다 다시 로그인 해주세요");
        }
        if (adStat === "등록") await deleteAllFiles(data);
        alert("서버 오류로 작업이 실패했습니다. 오류코드 : ", res.code);
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (data) {
        if (adStat === "등록") await deleteAllFiles(data);
      } else {
        console.warn("No data to delete files from.");
      }
      alert("작업 중 오류가 발생했습니다.");
    } finally {
      handleLoading(false);
    }
  };

  const deleteAllFiles = async data => {
    const fileUrls = [
      data.logoImg,
      data.adImg,
      ...(data.photoList ? data.photoList.split(",") : []),
    ].filter(Boolean); // `null` 또는 `undefined` 제거

    try {
      await Promise.all(fileUrls.map(url => deleteFile(url)));
      console.log("All files deleted successfully");
    } catch (error) {
      console.error("Error deleting files:", error);
      throw error;
    }
  };

  const processLogoImage = async (logoImg, beforeLogoImg) => {
    if (logoImg) {
      return await uploadFile(logoImg, "logo");
    }
    return beforeLogoImg || null;
  };
  const processPhotoList = async (photoList, beforePhotoList) => {
    if (photoList.length > 0) {
      const photoLists = await getMultipleImg(photoList, "office");
      return beforePhotoList.concat(photoLists).join(",");
    }
    return beforePhotoList ? beforePhotoList.join(",") : null;
  };

  //입력용 데이터
  const getData = async () => {
    const data = {};
    let result = "성공";
    //data.cid = "0825232a-9353-4be3-af82-69f9962b1f27"; // 임시 CID

    data.companyUserId = login.userId || null;
    if (!title) {
      result = "제목을 작성해 주세요";
      return { data, result };
    } else {
      data.title = title;
    }
    if (occupation.length === 0) {
      result = "업직종을 하나 이상 선택해 주세요";
      return { data, result };
    } else {
      data.jobType = occupation.join(",");
    }
    if (employType.length === 0) {
      result = "고용형태를 한개 이상 선택하세요";
      return { data, result };
    } else {
      data.employmentType = employType.join(",");
    }
    if (!headCountA) {
      result = "모집인원을 선택해 주세요";
      return { data, result };
    } else if (headCountA === "직접입력") {
      if (!headCountB) {
        result = "모집인원을 입력해 주세요";
        return { data, result };
      } else {
        if (isNaN(headCountB)) {
          data.recruitCount = headCountB;
        } else {
          data.recruitCount = `${headCountB}명`;
        }
      }
    } else {
      data.recruitCount = headCountA;
    }

    if (contact.first === "") {
      result = "연락처를 하나 이상 입력하세요";
      return { data, result };
    } else {
      data.managerPhone = `${contact.first}${contact.second}${contact.third}`;
      data.phoneShow = !contact.reveal;
    }
    if (subContact.first !== "") {
      data.managerSubPhone = `${subContact.first}${subContact.second}${subContact.third}`;
      data.subPhoneShow = !subContact.reveal;
    }
    if (!emailId) {
      result = "담당자 이메일을 입력하세요";
      return { data, result };
    } else {
      const emailChk = chkEmail(emailId);
      if (!emailChk) {
        result = "이메일 양식이 잘못되었습니다";
        return { data, result };
      } else {
        data.managerEmail = emailId;
      }
    }

    if (!period) {
      result = "근무기간을 선택해 주세요";
      return { data, result };
    } else {
      data.workPeriod = period;
    }
    data.probation = probation;
    data.periodDiscussion = periodDiscussion;
    data.workDate = workDate;
    if (workDate) {
      if (workDateList.length < 1) {
        result = "근무요일을 하나 이상 선택하세요";

        return { data, result };
      } else {
        data.workDays = workDateList.join(",");
      }
    }
    if (workDateDetail) {
      data.workDateDetail = workDateDetail;
    }

    if (workTime) {
      if (!startTime) {
        result = "시작시간을 선택하세요";

        return { data, result };
      } else if (!endTime) {
        result = "종료시간을 선택하세요";

        return { data, result };
      } else {
        data.workTime = workTime;
        data.workStart = startTime;
        data.workEnd = endTime;
      }
    }
    if (workTimeDetail) {
      data.workTimeDetail = workTimeDetail;
    }
    if (restTime) {
      data.restTime = `${restTime} ${rest}`;
    }
    data.salaryType = payType;

    if (!salary) {
      result = "급여 금액을 입력하세요";
      return { data, result };
    } else {
      data.salary = String(salary.replace(/,/g, ""));
      data.minPay = String(salary.replace(/,/g, ""));
      data.maxPay = String(salary.replace(/,/g, ""));
    }
    data.welfare = insurance.concat(vacation, incentive, support).join(",");

    data.preConditions = treat.join(",");
    data.etcConditions = condition.join(",");
    if (!gender) {
      result = "성별을 선택하세요";
      return { data, result };
    } else {
      data.gender = gender;
    }
    data.age = age ? "Y" : "N";
    if (age) {
      if (!maxAge || !minAge) {
        result = "채용하려는 연령대를 입력해 주세요";
        return { data, result };
      } else {
        data.maxAge = maxAge;
        data.minAge = minAge;
      }
    }
    if (!education) {
      result = "학력을 선택해 주세요";
      return { data, result };
    }
    data.education = education;
    data.endLimit = limit === "상시모집" ? false : true;
    if (limit !== "상시모집") {
      if (!limitDate) {
        result = "마감일을 선택하세요";

        return { data, result };
      } else {
        data.endDate = dayjs(limitDate).format("YYYY-MM-DD");
      }
    }
    if (!applyRoute.length > 0) {
      result = "지원방법을 하나 이상 선택하세요";
      return { data, result };
    }
    if (applyRoute.includes("기업바로지원")) {
      if (!applyUrl) {
        result = "바로지원 URL을 입력하세요";

        return { data, result };
      } else {
        data.applyUrl = applyUrl;
      }
    }
    if (!managerName) {
      result = "담당자 이름을 입력해 주세요";
      return { data, result };
    } else {
      data.managerName = managerName;
    }
    if (!companyName) {
      result = "회사명을 입력하세요";
      return { data, result };
    } else {
      data.company = companyName;
    }

    if (!zipCode || !addressA) {
      result = "주소찾기를 누르고 근무지 주소를 입력해 주세요";
      return { data, result };
    } else {
      data.zipCode = zipCode;
      data.address = addressA;
      data.addressDetail = addressB ? addressB : null;
    }

    data.sido = areaA.sido || null;
    data.sigungu = areaA.sigungu || null;
    data.dongEubMyun = areaA.dongEubMyun || null;
    data.sido2 = areaB.sido || null;
    data.sigungu2 = areaB.sigungu || null;
    data.dongEubMyun2 = areaB.dongEubMyun || null;
    data.sido3 = areaC.sido || null;
    data.sigungu3 = areaC.sigungu || null;
    data.dongEubMyun3 = areaC.dongEubMyun || null;
    data.x = locationX || null;
    data.y = locationY || null;
    if (universityShow === "선택") {
      data.nearUniversity = university;
    }
    const nearStation = [];
    for (const stat of station) {
      if (stat.show) {
        nearStation.push(stat);
      }
    }
    if (nearStation.length > 0) {
      data.nearInfoList = nearStation;
    }
    data.logoImg = await processLogoImage(logoImg, beforeData?.logoImg);

    data.photoList = await processPhotoList(photoList, beforePhotoList);

    if (detailImages.length > 0) {
      const { detailContent: updatedContent, images } = await filterImg(
        detailImages,
        detailContent
      );
      const mixedContent = await getMixed(updatedContent);
      data.detailContent = escapeHTML(mixedContent);
      if (uploadedImgs.length > 0) {
        const fullImages = images.concat(uploadedImgs);
        data.detailImages = fullImages.join(",");
      } else {
        data.detailImages = images.join(",");
      }
    } else {
      const mixedContent = await getMixed(detailContent);
      data.detailContent = escapeHTML(mixedContent);
      if (uploadedImgs.length > 0) {
        data.detailImages = uploadedImgs.join(",");
      }
    }

    data.adLink = imgApply;
    data.applyMethod = applyRoute.join(",");
    if (reserve) {
      if (!reserveDate) {
        result = "예약날짜를 선택해 주세요";

        return { data, result };
      } else {
        data.startDate = dayjs(reserveDate).format("YYYY-MM-DD");
      }
    } else {
      data.startDate = dayjs(new Date()).format("YYYY-MM-DD");
    }
    data.grade = Number(grade);
    data.focus = focus;

    return { data, result };
  };

  useEffect(() => {
    console.log(locationX, locationY);
  }, [locationX, locationY]);

  const getMixed = async text => {
    return text.replace(
      /src="http:\/\//g,
      'src="https://api.inssain.co.kr/redirect?url=http://'
    );
  };

  const filterImg = async (detailImages, detailContent) => {
    const uploadedImgs = []; // 업로드된 이미지 정보를 저장
    const images = []; // 최종 URL 목록

    // detailImages를 순회하며 작업 수행
    for (const image of detailImages) {
      const { file, alt } = image;

      // detailContent에 해당 alt 속성을 가진 <img> 태그가 있는지 확인
      const imgTagRegex = new RegExp(`<img[^>]*alt=['"]${alt}['"][^>]*>`, "g");
      if (imgTagRegex.test(detailContent)) {
        try {
          // 이미지를 업로드하고 URL 가져오기
          const uploadedUrl = await uploadFile(file, "ad");

          // 업로드된 이미지 정보를 uploadedImgs에 저장
          uploadedImgs.push({ url: uploadedUrl, alt });

          // detailContent에서 해당 alt를 가진 모든 <img> 태그를 새로운 태그로 대체
          detailContent = detailContent.replace(
            imgTagRegex,
            `<img src="${uploadedUrl}" alt="${alt}-changed" />`
          );
        } catch (error) {
          console.error(`Failed to upload image for alt=${alt}:`, error);
          continue;
        }
      }
    }

    // 업로드된 이미지를 images 배열에 저장
    uploadedImgs.forEach(img => {
      images.push(img.url);
    });

    // 수정된 detailContent와 업로드된 이미지 정보 반환
    return { detailContent, images };
  };

  const getMultipleImg = async (list, folder) => {
    const uploadPromises = list.map(photo => uploadFile(photo, folder));
    const photos = await Promise.all(uploadPromises);
    return photos;
  };

  const imgChk = detailContent => {
    // 정규식: data:image/로 시작하고 base64,로 이어지는 문자열 패턴을 매칭
    const base64Regex = /data:image\/[^;]+;base64,/;
    return base64Regex.test(detailContent);
  };

  /*
  const test = text => {
    setDetailContent(
      text.replace(/http:\/\//g, "https://cafecon.co.kr/redirect?url=http://")
    );
  };
  */
  const handleRemovePreview = preview => {
    const updatedPreviews = beforePhotoList.filter(item => item !== preview);
    setBeforePhotoList(updatedPreviews);
  };

  const handleLimitDate = event => {
    const value = event.target.value;
    setLimitDate(dayjs(value).format("2025-MM-DD"));
  };

  return (
    <>
      <div className="w-full max-w-[1240px] mx-auto mt-[100px] bg-white py-10 grid grid-cols-1 gap-y-[100px] mb-20 px-5">
        <div data="모집내용" className="grid grid-cols-1 gap-y-[30px] px-5">
          <h3 className="py-[10px] border-b border-[#ccc] lg:text-2xl font-extra text-[#069]">
            모집내용
          </h3>
          <div className="grid grid-cols-1 gap-y-[50px] px-5">
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">공고제목</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full relative">
                <input
                  type="text"
                  className="w-full p-2 border border-[#ccc] rounded-sm"
                  value={title || ""}
                  onChange={handleTitle}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs">
                  <span className="text-success">{title.length}</span> / 60자
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">업직종</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                {occupations.map((occ, idx) => (
                  <div
                    data={`업직종${idx + 1}`}
                    className="flex items-center gap-x-2"
                    key={idx}
                  >
                    <input
                      id={`occupation-${idx + 1}`}
                      type="checkbox"
                      value={occ}
                      name={`occupation-${idx + 1}`}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={occupation.includes(occ)}
                      onChange={handleOccupationChange}
                    />
                    <label
                      htmlFor={`occupation-${idx + 1}`}
                      className="text-sm"
                    >
                      {occ}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">고용형태</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="grid grid-cols-1">
                <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                  {employTypes.map((employ, idx) => (
                    <div
                      data={`고용형태${idx + 1}`}
                      className="flex items-center gap-x-2"
                      key={idx}
                    >
                      <input
                        id={`employType-${idx + 1}`}
                        type="checkbox"
                        value={employ}
                        name={`employType-${idx + 1}`}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        checked={employType.includes(employ)}
                        onChange={handleEmployTypeChange}
                      />
                      <label
                        htmlFor={`employType-${idx + 1}`}
                        className="text-sm"
                      >
                        {employ}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="text-[#666] font-normal text-xs">
                  ※다중 선택 가능합니다 (교육생/연수생은 다중 선택 불가능)
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">모집인원</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-1">
                {headCounts.map((head, idx) => (
                  <div
                    data={`모집인원${idx + 1}`}
                    className="flex items-center gap-x-2"
                    key={idx}
                  >
                    <input
                      id={`headCount-${idx + 1}`}
                      type="radio"
                      value={head}
                      name={`headCount-${idx + 1}`}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={headCountA === head}
                      onChange={handleHeadCountChange}
                    />
                    <label
                      htmlFor={`headCount-${idx + 1}`}
                      className="text-sm break-keep"
                    >
                      {head}
                    </label>
                    {idx + 1 === headCounts.length && (
                      <input
                        type="text"
                        className="w-full py-1 px-2 border border-[#ccc] rounded-sm"
                        value={headCountB || ""}
                        onChange={e => setHeadCountB(e.currentTarget.value)}
                        disabled={headCountA !== "직접입력"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div data="근무조건" className="grid grid-cols-1 gap-y-[30px] px-5">
          <h3 className="py-[10px] border-b border-[#ccc] lg:text-2xl font-extra text-[#069]">
            근무조건
          </h3>
          <div className="grid grid-cols-1 gap-y-[50px] px-5">
            <div
              data="근무기간"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-2">근무기간</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="grid grid-cols-1">
                <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                  {workPeriods.map((per, idx) => (
                    <div
                      data={`"근무기간${idx + 1}"`}
                      className="flex items-center gap-x-2"
                      key={idx}
                    >
                      <input
                        id={`period-${idx + 1}`}
                        type="radio"
                        value={per}
                        name={`period-${idx + 1}`}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        checked={period === per}
                        onChange={handlePeriodChange}
                      />
                      <label htmlFor={`period-${idx + 1}`} className="text-sm">
                        {per}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                  <div
                    data="기간협의가능"
                    className="flex items-center gap-x-2"
                  >
                    <input
                      id="probation"
                      type="checkbox"
                      name="probation"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={probation}
                      onChange={handleProbationChange}
                    />
                    <label htmlFor="probation" className="text-sm">
                      기간협의가능
                    </label>
                  </div>
                  <div
                    data="수습기간있음"
                    className="flex items-center gap-x-2"
                  >
                    <input
                      id="periodDiscussion"
                      type="checkbox"
                      name="periodDiscussion"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={periodDiscussion}
                      onChange={handlePeriodDiscussionChange}
                    />
                    <label htmlFor="periodDiscussion" className="text-sm">
                      수습기간있음
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              data="근무요일"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-2">근무요일</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="w-full relative flex flex-row justify-start gap-x-1 font-normal">
                  <button
                    className={`p-2 ${
                      !workDate
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setWorkDate(false)}
                  >
                    요일협의
                  </button>
                  <button
                    className={`p-2 ${
                      workDate
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setWorkDate(true)}
                  >
                    요일선택
                  </button>
                </div>
                {workDate ? (
                  <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                    <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                      <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                        요일 선택
                      </div>
                      <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                        <div className="flex items-center gap-x-2">
                          <input
                            id="workDay_1"
                            type="checkbox"
                            value="1"
                            onChange={handleWorkday}
                            checked={workDateList.includes("1")}
                            name="inline-checkbox-group0"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hover:cursor-pointer"
                          />
                          <label
                            htmlFor="workDay_1"
                            className="min-w-[20px] text-sm font-medium text-[#666] dark:text-gray-300"
                          >
                            월
                          </label>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <input
                            id="workDay_2"
                            type="checkbox"
                            value="2"
                            onChange={handleWorkday}
                            checked={workDateList.includes("2")}
                            name="inline-checkbox-group0"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hover:cursor-pointer"
                          />
                          <label
                            htmlFor="workDay_2"
                            className="min-w-[20px] text-sm font-medium text-[#666] dark:text-gray-300"
                          >
                            화
                          </label>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <input
                            id="workDay_3"
                            type="checkbox"
                            value="3"
                            onChange={handleWorkday}
                            checked={workDateList.includes("3")}
                            name="inline-checkbox-group0"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hover:cursor-pointer"
                          />
                          <label
                            htmlFor="workDay_3"
                            className="min-w-[20px] text-sm font-medium text-[#666] dark:text-gray-300"
                          >
                            수
                          </label>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <input
                            id="workDay_4"
                            type="checkbox"
                            value="4"
                            onChange={handleWorkday}
                            checked={workDateList.includes("4")}
                            name="inline-checkbox-group0"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hover:cursor-pointer"
                          />
                          <label
                            htmlFor="workDay_4"
                            className="min-w-[20px] text-sm font-medium text-[#666] dark:text-gray-300"
                          >
                            목
                          </label>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <input
                            id="workDay_5"
                            type="checkbox"
                            value="5"
                            onChange={handleWorkday}
                            checked={workDateList.includes("5")}
                            name="inline-checkbox-group0"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hover:cursor-pointer"
                          />
                          <label
                            htmlFor="workDay_5"
                            className="min-w-[20px] text-sm font-medium text-[#666] dark:text-gray-300"
                          >
                            금
                          </label>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <input
                            id="workDay_6"
                            type="checkbox"
                            value="6"
                            onChange={handleWorkday}
                            checked={workDateList.includes("6")}
                            name="inline-checkbox-group0"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hover:cursor-pointer"
                          />
                          <label
                            htmlFor="workDay_6"
                            className="min-w-[20px] text-sm font-medium text-[#666] dark:text-gray-300"
                          >
                            토
                          </label>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <input
                            id="workDay_0"
                            type="checkbox"
                            value="0"
                            onChange={handleWorkday}
                            checked={workDateList.includes("0")}
                            name="inline-checkbox-group0"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hover:cursor-pointer"
                          />
                          <label
                            htmlFor="workDay_0"
                            className="min-w-[20px] text-sm font-medium text-[#666] dark:text-gray-300"
                          >
                            일
                          </label>
                        </div>
                        <div className="items-center py-4 text-sm font-normal">
                          주{" "}
                          <span className="font-bold">
                            {workDateList.length}
                          </span>{" "}
                          일
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      참고사항
                    </div>
                    <div className="w-full relative p-2 bg-white">
                      <input
                        type="text"
                        className="w-full p-2 border border-[#ccc] rounded-sm font-normal"
                        value={workDateDetail || ""}
                        onChange={e => setWorkDateDetail(e.currentTarget.value)}
                        placeholder="예시) 주 3일 근무, 격주 토요일 등등"
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs">
                        <span className="text-success">
                          {workDateDetail.length}
                        </span>{" "}
                        / 40자
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              data="근무시간"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-2">근무시간</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="w-full relative flex flex-row justify-start gap-x-1 font-normal">
                  <button
                    className={`p-2 ${
                      !workTime
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setWorkTime(false)}
                  >
                    시간협의
                  </button>
                  <button
                    className={`p-2 ${
                      workTime
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setWorkTime(true)}
                  >
                    시간지정
                  </button>
                </div>
                {workTime ? (
                  <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                    <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                      <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                        시간 선택
                      </div>
                      <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                        <div className="flex items-center gap-x-2">
                          <select
                            id="startTime"
                            className="border border-gray-300 text-[#666] text-sm rounded focus:ring-orange-500 focus:border-orange-500 block w-full p-1 py-2"
                            value={startTime || ""}
                            onChange={e => {
                              setStartTime(e.currentTarget.value);
                            }}
                          >
                            <option value="">시간 선택</option>
                            {times.map((time, idx) => (
                              <option key={idx} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-x-2">~</div>
                        <div className="flex items-center gap-x-2">
                          <select
                            id="endTime"
                            className="border border-gray-300 text-[#666] text-sm rounded focus:ring-orange-500 focus:border-orange-500 block w-full p-1 py-2"
                            value={endTime || ""}
                            onChange={e => {
                              setEndTime(e.currentTarget.value);
                            }}
                          >
                            <option value="">시간 선택</option>
                            {times.map((time, idx) => (
                              <option key={idx} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-x-2">
                          휴게시간
                        </div>
                        <div className="flex items-center gap-x-2">
                          <input
                            type="text"
                            className="w-full p-2 border border-[#ccc] rounded-sm font-normal min-w-[200px]"
                            value={restTime || ""}
                            onChange={handleRestTime}
                            placeholder="점심포함 휴게시간"
                          />
                          <select
                            id="rest"
                            className="border border-gray-300 text-[#666] text-sm rounded focus:ring-orange-500 focus:border-orange-500 block w-full p-1 py-2"
                            value={rest || ""}
                            onChange={e => {
                              setRest(e.currentTarget.value);
                            }}
                          >
                            <option value="시간">시간</option>
                            <option value="분">분</option>
                          </select>
                        </div>
                        {startTime && endTime ? (
                          <div className="items-center py-4 text-sm font-normal">
                            일일{" "}
                            <span className="font-bold">{workTimePeriod}</span>{" "}
                            근무(휴게시간 포함){" "}
                            {isNightWork && (
                              <span className="text-xs text-[#666]">
                                (종료시간이 더 적을 경우 자동으로 익일로
                                지정됩니다)
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      참고사항
                    </div>
                    <div className="w-full relative p-2 bg-white">
                      <input
                        type="text"
                        className="w-full p-2 border border-[#ccc] rounded-sm font-normal"
                        value={workTimeDetail || ""}
                        onChange={e => setWorkTimeDetail(e.currentTarget.value)}
                        placeholder="예시) 평일 오전, 주말 오전 근무 등"
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs">
                        <span className="text-success">
                          {workTimeDetail ? workTimeDetail.length : 0}
                        </span>{" "}
                        / 40자
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              data="급여조건"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-2">급여</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="w-full relative flex flex-row justify-start gap-x-1 font-normal">
                  <button
                    className={`p-2 ${
                      payType === "시급"
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setPayType("시급")}
                  >
                    시급
                  </button>
                  <button
                    className={`p-2 ${
                      payType === "일급"
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setPayType("일급")}
                  >
                    일급
                  </button>
                  <button
                    className={`p-2 ${
                      payType === "주급"
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setPayType("주급")}
                  >
                    주급
                  </button>
                  <button
                    className={`p-2 ${
                      payType === "월급"
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setPayType("월급")}
                  >
                    월급
                  </button>
                  <button
                    className={`p-2 ${
                      payType === "연봉"
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setPayType("연봉")}
                  >
                    연봉
                  </button>
                  <button
                    className={`p-2 ${
                      payType === "건별"
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setPayType("건별")}
                  >
                    건별
                  </button>
                </div>
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      급여
                    </div>
                    <div className="w-full relative p-2 bg-white">
                      <input
                        type="text"
                        className="w-full p-2 border border-[#ccc] rounded-sm font-normal"
                        value={salary || ""}
                        onChange={e => {
                          setSalary(e.currentTarget.value);
                          setFormatedSalary(e.currentTarget.value);
                        }}
                        onFocus={() => setSalary(formattedSalary)}
                        onBlur={e =>
                          setSalary(
                            Number(e.currentTarget.value).toLocaleString()
                          )
                        }
                        placeholder="2025년 최저시급 10,030원"
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs">
                        원
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              data="복지"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-4">복지</div>
              <div className="lg:w-fit min-w-[48px] text-success py-4"></div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      4대보험
                    </div>
                    <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                      <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                        {insurances.map((ins, idx) => (
                          <div
                            data={`4대보험${idx + 1}`}
                            className="flex items-center gap-x-2"
                            key={idx}
                          >
                            <input
                              id={`insurance-${idx + 1}`}
                              type="checkbox"
                              value={ins}
                              name={`insurance-${idx + 1}`}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                              checked={insurance.includes(ins)}
                              onChange={handleInsuranceChange}
                            />
                            <label
                              htmlFor={`insurance-${idx + 1}`}
                              className="text-sm"
                            >
                              {ins}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      휴일제도
                    </div>
                    <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                      <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                        {vacations.map((vac, idx) => (
                          <div
                            data={`휴일제도${idx + 1}`}
                            className="flex items-center gap-x-2"
                            key={idx}
                          >
                            <input
                              id={`vacation-${idx + 1}`}
                              type="checkbox"
                              value={vac}
                              name={`vacation-${idx + 1}`}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                              checked={vacation.includes(vac)}
                              onChange={handleVacationChange}
                            />
                            <label
                              htmlFor={`vacation-${idx + 1}`}
                              className="text-sm"
                            >
                              {vac}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      수당제도
                    </div>
                    <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                      <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                        {incentives.map((inc, idx) => (
                          <div
                            data={`수당제도${idx + 1}`}
                            className="flex items-center gap-x-2"
                            key={idx}
                          >
                            <input
                              id={`incentive-${idx + 1}`}
                              type="checkbox"
                              value={inc}
                              name={`incentive-${idx + 1}`}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                              checked={incentive.includes(inc)}
                              onChange={handleIncentiveChange}
                            />
                            <label
                              htmlFor={`incentive-${idx + 1}`}
                              className="text-sm"
                            >
                              {inc}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      기타복지
                    </div>
                    <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                      <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                        {supports.map((sup, idx) => (
                          <div
                            data={`기타복지${idx + 1}`}
                            className="flex items-center gap-x-2"
                            key={idx}
                          >
                            <input
                              id={`support-${idx + 1}`}
                              type="checkbox"
                              value={sup}
                              name={`support-${idx + 1}`}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                              checked={support.includes(sup)}
                              onChange={handleSupportChange}
                            />
                            <label
                              htmlFor={`support-${idx + 1}`}
                              className="text-sm"
                            >
                              {sup}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              data="우대기타"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-4">
                우대/
                <br />
                기타조건
              </div>
              <div className="lg:w-fit min-w-[48px] text-success py-4"></div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      우대조건
                    </div>
                    <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                      <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                        {treats.map((tre, idx) => (
                          <div
                            data={`우대조건${idx + 1}`}
                            className="flex items-center gap-x-2"
                            key={idx}
                          >
                            <input
                              id={`treat-${idx + 1}`}
                              type="checkbox"
                              value={tre}
                              name={`treat-${idx + 1}`}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                              checked={treat.includes(tre)}
                              onChange={handleTreatChange}
                            />
                            <label
                              htmlFor={`treat-${idx + 1}`}
                              className="text-sm"
                            >
                              {tre}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      기타조건
                    </div>
                    <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                      <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                        {conditions.map((con, idx) => (
                          <div
                            data={`기타조건${idx + 1}`}
                            className="flex items-center gap-x-2"
                            key={idx}
                          >
                            <input
                              id={`condition-${idx + 1}`}
                              type="checkbox"
                              value={con}
                              name={`condition-${idx + 1}`}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                              checked={condition.includes(con)}
                              onChange={handleConditionChange}
                            />
                            <label
                              htmlFor={`condition-${idx + 1}`}
                              className="text-sm"
                            >
                              {con}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data="지원조건" className="grid grid-cols-1 gap-y-[30px] px-5">
          <h3 className="py-[10px] border-b border-[#ccc] lg:text-2xl font-extra text-[#069]">
            지원조건
          </h3>
          <div className="grid grid-cols-1 gap-y-[50px] px-5">
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">성별</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                {genders.map((gen, idx) => (
                  <div
                    data={`성별${idx + 1}`}
                    className="flex items-center gap-x-2"
                    key={idx}
                  >
                    <input
                      id={`gender-${idx + 1}`}
                      type="radio"
                      value={gen}
                      name={`gender-${idx + 1}`}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={gender === gen}
                      onChange={handleGenderChange}
                    />
                    <label htmlFor={`gender-${idx + 1}`} className="text-sm">
                      {gen}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div
              data="연령"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-2">연령</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="w-full relative flex flex-row justify-start gap-x-1 font-normal">
                  <button
                    className={`p-2 ${
                      !age
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => {
                      setAge(false);
                      setMinAge("");
                      setMaxAge("");
                    }}
                  >
                    연령무관
                  </button>
                  <button
                    className={`p-2 ${
                      age
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setAge(true)}
                  >
                    연령선택
                  </button>
                </div>
                {age && (
                  <div className="flex flex-row justify-start gap-x-2 text-sm font-bold">
                    <div className="w-[200px] relative bg-white">
                      <input
                        type="text"
                        className="w-full p-2 border border-[#ccc] rounded-sm font-normal"
                        value={minAge || ""}
                        onChange={e => {
                          setMinAge(e.currentTarget.value);
                        }}
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-2 text-xs">
                        세
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">부터</div>
                    <div className="w-[200px] relative bg-white">
                      <input
                        type="text"
                        className="w-full p-2 border border-[#ccc] rounded-sm font-normal"
                        value={maxAge || ""}
                        onChange={e => {
                          setMaxAge(e.currentTarget.value);
                        }}
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-2 text-xs">
                        세
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">까지</div>
                  </div>
                )}
              </div>
            </div>

            <div
              data="학력"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-2">학력</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="flex flex-row justify-start gap-x-2 text-sm font-bold">
                <div className="flex items-center gap-x-2">
                  <select
                    id="startTime"
                    className="border border-gray-300 text-[#666] text-sm rounded focus:ring-orange-500 focus:border-orange-500 block w-full p-1 py-2"
                    value={education || ""}
                    onChange={e => {
                      setEducation(e.currentTarget.value);
                    }}
                  >
                    {educations.map((edu, idx) => (
                      <option key={idx} value={edu === "학력선택" ? "" : edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data="접수기간방법" className="grid grid-cols-1 gap-y-[30px] px-5">
          <h3 className="py-[10px] border-b border-[#ccc] lg:text-2xl font-extra text-[#069]">
            접수기간/방법
          </h3>
          <div className="grid grid-cols-1 gap-y-[50px] px-5">
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-4">모집마감일</div>
              <div className="lg:w-fit min-w-[48px] text-success py-4">
                필수
              </div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                  <div data="상시모집" className="flex items-center gap-x-2">
                    <input
                      id="no-limit"
                      type="radio"
                      value="상시모집"
                      name="limit"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={limit === "상시모집"}
                      onChange={handleLimitChange}
                    />
                    <label htmlFor="no-limit" className="text-sm">
                      상시모집
                    </label>
                  </div>
                  <div data="마감일 지정" className="flex items-center gap-x-2">
                    <input
                      id="dayLimit"
                      type="radio"
                      value="마감일지정"
                      name="limit"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={limit === "마감일지정"}
                      onChange={handleLimitChange}
                    />
                    <label htmlFor="dayLimit" className="text-sm break-keep">
                      마감일지정
                    </label>
                    {limit === "마감일지정" && (
                      <input
                        type="text"
                        className="w-fit min-w-[100px] py-1 px-2 border border-[#ccc] rounded-sm"
                        defaultValue={
                          limitDate ? dayjs(limitDate).format("YYYY-MM-DD") : ""
                        }
                        disabled={limit !== "마감일지정"}
                      />
                    )}
                  </div>

                  <div data="마감일 지정" className="flex items-center gap-x-2">
                    <input
                      id="limitInput"
                      type="radio"
                      value="마감일직접입력"
                      name="limit"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={limit === "마감일직접입력"}
                      onChange={handleLimitChange}
                    />
                    <label htmlFor="limitInput" className="text-sm break-keep">
                      마감일직접입력
                    </label>
                    {limit === "마감일직접입력" && (
                      <input
                        type="text"
                        className="w-fit min-w-[100px] py-1 px-2 border border-[#ccc] rounded-sm"
                        value={limitDate}
                        onBlur={handleLimitDate}
                        onChange={e => setLimitDate(e.currentTarget.value)}
                        disabled={limit !== "마감일직접입력"}
                      />
                    )}
                  </div>
                </div>
                {limit === "마감일지정" ? (
                  <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y w-fit">
                    <div className="flex flex-row justify-start gap-x-1 text-sm font-bold pr-4">
                      <div className="lg:w-fit text-center min-w-[120px] pl-2 py-4 flex flex-col justify-center">
                        마감일 지정
                      </div>
                      <div className="pl-2 py-4">
                        <div className="bg-white w-fit border border-[#ccc]">
                          <DayPicker
                            mode="single"
                            timeZone="Asia/Seoul"
                            locale={ko}
                            numberOfMonths={2}
                            selected={limitDate}
                            onSelect={setLimitDate}
                            classNames={{
                              today: `bg-green-100 rounded-full`, // Add a border to today's date
                              selected: `bg-blue-100 rounded-full important`, // Highlight the selected day
                              root: `${defaultClassNames.root} p-5`, // Add a shadow to the root element
                              caption_label: `${defaultClassNames.caption_label}`,
                              chevron: `${defaultClassNames.chevron} fill-amber-500`, // Change the color of the chevron
                              months: `${defaultClassNames.months} grid grid-cols-2 gap-x-2`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
              ref={applyRef}
            >
              <div className="lg:w-fit min-w-[84px] py-2">지원방법</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="grid grid-cols-1">
                <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                  {applyRoutes.map((route, idx) => (
                    <div
                      data={`지원방법${idx + 1}`}
                      className="flex items-center gap-x-2"
                      key={idx}
                    >
                      <input
                        id={`applyRoute-${idx + 1}`}
                        type="checkbox"
                        value={route}
                        name={`applyRoute-${idx + 1}`}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        checked={applyRoute.includes(route)}
                        onChange={handleApplyRouteChange}
                      />
                      <label
                        htmlFor={`applyRoute-${idx + 1}`}
                        className="text-sm"
                      >
                        {route}
                      </label>
                      {route === "기업바로지원" &&
                      applyRoute.includes("기업바로지원") ? (
                        <input
                          type="text"
                          className="min-w-[300px] px-2 py-1 border border-[#ccc] rounded-sm"
                          value={applyUrl || ""}
                          onChange={e => setApplyUrl(e.currentTarget.value)}
                          onBlur={() => {
                            if (applyUrl !== "") {
                              setImgApply(true);
                            } else {
                              setImgApply(false);
                            }
                          }}
                          placeholder="지원 가능한 URL을 입력해 주세요"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data="근무지정보" className="grid grid-cols-1 gap-y-[30px] px-5">
          <h3 className="py-[10px] border-b border-[#ccc] lg:text-2xl font-extra text-[#069]">
            근무지 정보
          </h3>
          <div className="grid grid-cols-1 gap-y-[50px] px-5">
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">근무 회사명</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full relative">
                <input
                  type="text"
                  className="w-full p-2 border border-[#ccc] rounded-sm"
                  value={companyName || ""}
                  onChange={handleCompanyNameChange}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs">
                  <span className="text-success">{companyName.length}</span> /
                  40자
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">근무지 주소</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="w-full flex justify-start gap-x-1">
                  <input
                    type="text"
                    className="w-[70px] py-1 px-2 border border-[#ccc] rounded-sm"
                    value={zipCode || ""}
                    onChange={e => setZipCode(e.currentTarget.value)}
                    disabled
                  />
                  <input
                    type="text"
                    className="w-[300px] py-1 px-2 border border-[#ccc] rounded-sm"
                    value={addressA || ""}
                    onChange={e => setAddressA(e.currentTarget.value)}
                    placeholder="주소찾기를 눌러주세요"
                    disabled
                  />
                  <input
                    type="text"
                    className="w-[300px] py-1 px-2 border border-[#ccc] rounded-sm"
                    value={addressB || ""}
                    onChange={e => setAddressB(e.currentTarget.value)}
                    placeholder="건물명 등 상세주소 입력"
                    disabled={!addressA}
                  />
                  <div className="w-[300px] grid grid-cols-2 gap-x-2">
                    <button
                      className={`p-2 bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700`}
                      onClick={() => {
                        openPostCode();
                      }}
                    >
                      주소 찾기
                    </button>
                    <button
                      className={`p-2 border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700 hidden`}
                      onClick={() => {
                        setModalOn(true);
                        setModalType("map");
                        setZipCode("01234");
                        setAddressA("서울시 중구 다산로38길 66-47");
                      }}
                    >
                      지도 확인
                    </button>
                  </div>
                </div>
                {zipCode && addressA ? (
                  <>
                    {university && (
                      <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                        <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                          <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                            주변대학교
                          </div>
                          <div className="w-full flex flex-row justify-start gap-x-10 flex-nowrap bg-white">
                            <div className="px-2 py-4 break-keep w-[200px] text-center">
                              {university}
                            </div>
                            <div className="flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2 bg-white">
                              <div
                                data="근처대학교 선택"
                                className="flex items-center gap-x-2"
                              >
                                <input
                                  id="universitySelect"
                                  type="radio"
                                  value="선택"
                                  name="universitySelect"
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                  checked={universityShow === "선택"}
                                  onChange={handleUniversityChange}
                                />
                                <label
                                  htmlFor="universitySelect"
                                  className="text-sm"
                                >
                                  선택
                                </label>
                              </div>
                              <div
                                data="근처대학교 선택"
                                className="flex items-center gap-x-2"
                              >
                                <input
                                  id="universityDontSelect"
                                  type="radio"
                                  value="미선택"
                                  name="universityDontSelect"
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                  checked={universityShow === "미선택"}
                                  onChange={handleUniversityChange}
                                />
                                <label
                                  htmlFor="universityDontSelect"
                                  className="text-sm break-keep"
                                >
                                  미선택
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {station.length > 0 ? (
                      <>
                        <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                          <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                            <div
                              className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center"
                              onClick={() => console.log(station)}
                            >
                              주변지하철
                            </div>
                            <div className="grid grid-cols-1 gap-y-[1px] w-full">
                              {station.map((stat, idx) => (
                                <div
                                  className="w-full flex flex-row justify-start gap-x-10 flex-nowrap bg-white py-2"
                                  key={idx}
                                >
                                  <div className="px-2 py-2 break-keep w-[150px] text-center">
                                    {stat.nearStation}
                                  </div>
                                  <div className="p-2 break-keep w-[150px] text-center rounded-full text-white font-bold">
                                    <span
                                      style={{
                                        backgroundColor: stat.subwayColor,
                                      }}
                                      className="px-2 py-1 rounded-full"
                                    >
                                      {stat.line}
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    className="w-[200px] py-1 px-2 border border-[#ccc] rounded-sm"
                                    value={`${stat.distance} (${stat.durationTime})`}
                                    disabled
                                  />
                                  <div className="flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-1 bg-white">
                                    <div
                                      data="지하철역 선택"
                                      className="flex items-center gap-x-2"
                                    >
                                      <input
                                        id={`stateionSelect-${idx}`}
                                        type="radio"
                                        value="선택"
                                        name={`stateionSelect-${idx}`}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                        checked={stat.show}
                                        onChange={() =>
                                          handleStationChange(idx, true)
                                        }
                                      />
                                      <label
                                        htmlFor={`stateionSelect-${idx}`}
                                        className="text-sm"
                                      >
                                        선택
                                      </label>
                                    </div>
                                    <div
                                      data="지하철역 비선택"
                                      className="flex items-center gap-x-2"
                                    >
                                      <input
                                        id={`noStationSelect-${idx}`}
                                        type="radio"
                                        value="미선택"
                                        name={`stateionSelect-${idx}`}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                        checked={!stat.show}
                                        onChange={() =>
                                          handleStationChange(idx, false)
                                        }
                                      />
                                      <label
                                        htmlFor={`noStationSelect-${idx}`}
                                        className="text-sm break-keep"
                                      >
                                        미선택
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="flex flex-col justify-start w-fit gap-0">
                <div className="lg:w-fit min-w-[84px] py-1">공고노출지역</div>
                <div className="text-center text-xs py-1">({areaCount}/3)</div>
              </div>
              <div className="lg:w-fit min-w-[48px] text-success py-1">
                필수
              </div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                      지역선택 1
                    </div>
                    <div className="w-full flex flex-row justify-start gap-x-10 flex-nowrap bg-white">
                      <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                        {areaA.sido !== "" &&
                        areaA.sigungu !== "" &&
                        areaA.dongEubMyun !== "" ? (
                          <div className="flex items-center gap-x-2 w-full">
                            <div className="min-w-[400px]">
                              {areaA.sido} {areaA.sigungu} {areaA.dongEubMyun}
                            </div>
                            <button
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white w-[20%] rounded font-bold"
                              onClick={() => {
                                setModalOn(true);
                                setModalType("areaA");
                              }}
                            >
                              노출지역 1 재설정
                            </button>
                            {areaCount === 1 && (
                              <button
                                className="border border-success border-dashed p-2 text-success font-normal break-keep"
                                onClick={() => deleteArea("A")}
                              >
                                초기화
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-x-2 w-full">
                            <button
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white w-[80%] rounded font-bold"
                              onClick={() => {
                                setModalOn(true);
                                setModalType("areaA");
                              }}
                            >
                              노출지역 1 설정
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {areaCount >= 2 && (
                  <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                    <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                      <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                        지역선택 2
                      </div>
                      <div className="w-full flex flex-row justify-start gap-x-10 flex-nowrap bg-white">
                        <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                          {areaB.sido !== "" &&
                          areaB.sigungu !== "" &&
                          areaB.dongEubMyun !== "" ? (
                            <div className="flex items-center gap-x-2 w-full">
                              <div className="min-w-[400px]">
                                {areaB.sido} {areaB.sigungu} {areaB.dongEubMyun}
                              </div>
                              <button
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white w-[20%] rounded font-bold"
                                onClick={() => {
                                  setModalOn(true);
                                  setModalType("areaB");
                                }}
                              >
                                노출지역 2 재설정
                              </button>

                              {areaCount === 2 && (
                                <button
                                  className="border border-success border-dashed p-2 text-success font-normal break-keep"
                                  onClick={() => deleteArea("B")}
                                >
                                  - 삭제하기
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-x-2 w-full">
                              <button
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white w-[80%] rounded font-bold"
                                onClick={() => {
                                  setModalOn(true);
                                  setModalType("areaB");
                                }}
                              >
                                노출지역 2 설정
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {areaCount >= 3 && (
                  <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                    <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                      <div className="lg:w-fit min-w-[84px] py-4 pl-2 flex flex-col justify-center">
                        지역선택 3
                      </div>
                      <div className="w-full flex flex-row justify-start gap-x-10 flex-nowrap bg-white">
                        <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full pl-2">
                          {areaC.sido !== "" &&
                          areaC.sigungu !== "" &&
                          areaC.dongEubMyun !== "" ? (
                            <div className="flex items-center gap-x-2 w-full">
                              <div className="min-w-[400px]">
                                {areaC.sido} {areaC.sigungu} {areaC.dongEubMyun}
                              </div>
                              <button
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white w-[20%] rounded font-bold"
                                onClick={() => {
                                  setModalOn(true);
                                  setModalType("areaC");
                                }}
                              >
                                노출지역 3 재설정
                              </button>

                              {areaCount === 3 && (
                                <button
                                  className="border border-success border-dashed p-2 text-success font-normal break-keep"
                                  onClick={() => deleteArea("C")}
                                >
                                  - 삭제하기
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-x-2 w-full">
                              <button
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white w-[80%] rounded font-bold"
                                onClick={() => {
                                  setModalOn(true);
                                  setModalType("areaC");
                                }}
                              >
                                노출지역 3 설정
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {areaCount < 3 && (
                  <button
                    className="border border-primary border-dashed p-2 text-primary font-normal"
                    onClick={() => addArea()}
                  >
                    +추가하기
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-4">근무지 로고</div>
              <div className="lg:w-fit min-w-[48px] text-success py-4">
                필수
              </div>
              <div className="w-full bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                <div className="flex flex-row justify-start gap-x-1 text-sm font-bold py-1 pr-2">
                  <div className="lg:w-fit min-w-[112px] py-1 pl-2 flex flex-col justify-center break-keep whitespace-nowrap mx-4">
                    로고 이미지 선택
                  </div>
                  <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full px-2 py-1">
                    <UploadImg
                      title={"로고이미지"}
                      type={"logo"}
                      file={logoImg}
                      setFile={setLogoImg}
                    />
                    {beforeData && beforeData.logoImg && (
                      <div className="flex gap-x-2">
                        <div className="flex flex-col justify-center h-full bg-[#eaeaea] px-2">
                          기존 로고
                        </div>
                        <img
                          src={beforeData.logoImg}
                          alt="기존로고"
                          className="min-w-[60px] w-auto max-w-[100px] h-auto max-h-[150px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-4">근무지 사진</div>
              <div className="lg:w-fit min-w-[48px] text-success py-4"></div>
              <div className="w-full bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                <div className="flex flex-row justify-start gap-x-1 text-sm font-bold py-1 pr-2">
                  <div className="lg:w-fit min-w-[112px] py-1 pl-2 flex flex-col justify-center break-keep whitespace-nowrap mx-4">
                    근무지 사진
                  </div>
                  <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full px-2 py-1">
                    <MultipleUploadImg
                      title={"근무지 사진"}
                      type={"photo"}
                      files={photoList}
                      setFiles={setPhotoList}
                      before={beforePhotoList}
                    />
                    {beforePhotoList && beforePhotoList.length > 0 && (
                      <div className="flex gap-x-2 w-full">
                        <div className="flex flex-col justify-center h-full bg-[#eaeaea] px-2">
                          기존 사진
                        </div>
                        <div className="grid grid-cols-1 gap-y-2">
                          <div className="w-full relative flex flex-row justify-end gap-x-[50px] gap-y-3 flex-wrap font-normal py-1">
                            <button
                              type="button"
                              className="px-2 py-0.5 bg-[#efefef] hover:bg-[#e5e5e5] rounded-sm border border-black"
                              onClick={() => {
                                setBeforePhotoList([]); // 미리보기 이미지 초기화
                              }}
                            >
                              기존 파일 초기화
                            </button>
                          </div>
                          <div className="grid grid-cols-5 gap-x-4 gap-y-4">
                            {beforePhotoList.map((preview, index) => (
                              <div
                                key={index}
                                className="relative p-1 border border-[#ccc] h-fit z-0 hover:cursor-pointer"
                              >
                                <div className="w-full h-full">
                                  <img
                                    src={preview} // 미리보기 이미지 경로 사용
                                    className="min-w-[60px] w-auto max-w-[100px] h-auto max-h-[150px] mx-auto"
                                    alt={`미리보기 ${index + 1}`}
                                  />
                                </div>
                                {/* X 버튼 */}
                                <button
                                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 hover:bg-red-600"
                                  onClick={() => handleRemovePreview(preview)}
                                >
                                  삭제
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div data="담당자 정보" className="grid grid-cols-1 gap-y-[30px] px-5">
          <h3 className="py-[10px] border-b border-[#ccc] lg:text-2xl font-extra text-[#069]">
            담당자 정보
          </h3>
          <div className="grid grid-cols-1 gap-y-[50px] px-5">
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">담당자명</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full relative">
                <input
                  type="text"
                  className="w-full p-2 border border-[#ccc] rounded-sm"
                  value={managerName || ""}
                  onChange={handleManagerName}
                  placeholder="최대 20자 (공백포함)"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs">
                  <span className="text-success">{title.length}</span> / 20자
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-2">이메일 주소</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full flex justify-start gap-x-1">
                <input
                  type="text"
                  className="w-full p-2 border border-[#ccc] rounded-sm"
                  value={emailId || ""}
                  onChange={handleEmail}
                  placeholder="예시) abcde@fghijklmn.com"
                />
              </div>
            </div>

            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="flex flex-col justify-start w-fit gap-0">
                <div className="lg:w-fit min-w-[84px] py-2">연락처</div>
              </div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                  <select
                    id="contact"
                    className="border w-[10%] border-gray-300 text-[#666] text-sm rounded focus:ring-orange-500 focus:border-orange-500 block p-1 py-2"
                    value={contact.first || ""}
                    onChange={e => {
                      handleContactChange(
                        "first",
                        e.currentTarget.value,
                        "Main"
                      );
                    }}
                  >
                    {phoneNums.map((phone, idx) => (
                      <option key={idx} value={phone.value}>
                        {phone.txt}
                      </option>
                    ))}
                  </select>
                  <span className="py-2">-</span>
                  <input
                    type="text"
                    className="w-[20%] p-2 border border-[#ccc] rounded-sm"
                    value={contact.second || ""}
                    onChange={e =>
                      handleContactChange(
                        "second",
                        e.currentTarget.value,
                        "Main"
                      )
                    }
                  />
                  <span className="py-2">-</span>

                  <input
                    type="text"
                    className="w-[20%] p-2 border border-[#ccc] rounded-sm"
                    value={contact.third || ""}
                    onChange={e =>
                      handleContactChange(
                        "third",
                        e.currentTarget.value,
                        "Main"
                      )
                    }
                  />
                  <div className="flex items-center gap-x-2 mx-3">
                    <input
                      id="contactReveal"
                      type="checkbox"
                      name="contactReveal"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={contact.reveal}
                      onChange={e =>
                        handleContactCheckChange("reveal", e, "Main")
                      }
                    />
                    <label htmlFor="contactReveal" className="text-sm">
                      비공개
                    </label>
                  </div>
                  {!addContact && (
                    <button
                      className="border border-primary border-dashed p-2 text-primary font-normal"
                      onClick={() => setAddContact(true)}
                    >
                      + 추가하기
                    </button>
                  )}
                </div>
                {addContact && (
                  <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                    <select
                      id="subContact"
                      className="border w-[10%] border-gray-300 text-[#666] text-sm rounded focus:ring-orange-500 focus:border-orange-500 block p-1 py-2"
                      value={subContact.first || ""}
                      onChange={e => {
                        handleContactChange(
                          "first",
                          e.currentTarget.value,
                          "Sub"
                        );
                      }}
                    >
                      {phoneNums.map((phone, idx) => (
                        <option key={idx} value={phone.value}>
                          {phone.txt}
                        </option>
                      ))}
                    </select>
                    <span className="py-2">-</span>
                    <input
                      type="text"
                      className="w-[20%] p-2 border border-[#ccc] rounded-sm"
                      value={subContact.second || ""}
                      onChange={e =>
                        handleContactChange(
                          "second",
                          e.currentTarget.value,
                          "Sub"
                        )
                      }
                    />
                    <span className="py-2">-</span>

                    <input
                      type="text"
                      className="w-[20%] p-2 border border-[#ccc] rounded-sm"
                      value={subContact.third || ""}
                      onChange={e =>
                        handleContactChange(
                          "third",
                          e.currentTarget.value,
                          "Sub"
                        )
                      }
                    />

                    <div className="flex items-center gap-x-2 mx-3">
                      <input
                        id="subContactReveal"
                        type="checkbox"
                        name="subContactReveal"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        checked={subContact.reveal}
                        onChange={e =>
                          handleContactCheckChange("reveal", e, "Sub")
                        }
                      />
                      <label htmlFor="subContactReveal" className="text-sm">
                        비공개
                      </label>
                    </div>
                    {addContact && (
                      <button
                        className="border border-success border-dashed p-2 text-success font-normal"
                        onClick={() => {
                          setSubContact({
                            first: "",
                            second: "",
                            third: "",
                            reveal: false,
                          });
                          setAddContact(false);
                        }}
                      >
                        + 삭제하기
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div data="상세모집내용" className="grid grid-cols-1 gap-y-[30px] px-5">
          <h3 className="py-[10px] border-b border-[#ccc] lg:text-2xl font-extra text-[#069]">
            상세모집내용
          </h3>
          <div className="grid grid-cols-1 gap-y-[50px] px-5">
            {!noUse ? null : (
              <>
                <div className="flex flex-row justify-start gap-x-1 text-sm font-bold py-1">
                  <div className="lg:w-fit min-w-[84px] py-4">광고 이미지</div>
                  <div className="lg:w-fit min-w-[48px] text-success py-1"></div>
                  <div className="w-full bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                    <div className="flex flex-row justify-start gap-x-1 text-sm font-bold py-1 pr-2">
                      <div className="lg:w-fit min-w-[112px] py-1 pl-2 flex flex-col justify-center break-keep whitespace-nowrap mx-4">
                        광고 이미지 선택
                      </div>
                      <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full px-2 py-1">
                        <UploadImg
                          title={"로고이미지"}
                          file={adImg}
                          setFile={setAdImg}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                  <div className="lg:w-fit min-w-[84px] py-1">바로지원연동</div>
                  <div className="lg:w-fit min-w-[48px] text-success py-1"></div>
                  <div className="grid grid-cols-1 gap-y-1">
                    <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-1">
                      <div data="연동함" className="flex items-center gap-x-2">
                        <input
                          id="ad-apply"
                          type="radio"
                          name="ad-applyIt"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                          checked={imgApply}
                          onChange={() => {
                            if (applyUrl) {
                              setImgApply(true);
                            } else {
                              alert(
                                "지원방법 기업바로지원 체크 후 기업바로지원 URL을 등록하셔야 연동 가능합니다."
                              );
                              scrollToApply();
                            }
                          }} // value 대신 직접 boolean 값 설정
                        />
                        <label htmlFor="ad-apply" className="text-sm">
                          연동함
                        </label>
                      </div>
                      <div
                        data="연동안함"
                        className="flex items-center gap-x-2"
                      >
                        <input
                          id="ad-no-apply"
                          type="radio"
                          name="ad-applyIt"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                          checked={!imgApply}
                          onChange={() => setImgApply(false)} // value 대신 직접 boolean 값 설정
                        />
                        <label
                          htmlFor="ad-no-apply"
                          className="text-sm break-keep"
                        >
                          연동안함
                        </label>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold">
                        지원방법 &gt; 기업바로지원 URL
                      </span>
                      을 광고이미지와 연동합니다 (없으면 불가능)
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
                  <div className="lg:w-fit min-w-[84px] py-1">이미지 위치</div>
                  <div className="lg:w-fit min-w-[48px] text-success py-1"></div>
                  <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-1">
                    <div data="바로등록" className="flex items-center gap-x-2">
                      <input
                        id="ad-up"
                        type="radio"
                        name="ad-side"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        checked={adPosition === "up"}
                        onChange={() => setAdPosition("up")} // value 대신 직접 boolean 값 설정
                      />
                      <label htmlFor="ad-up" className="text-sm">
                        상세내용 위로
                      </label>
                    </div>
                    <div data="예약일" className="flex items-center gap-x-2">
                      <input
                        id="ad-down"
                        type="radio"
                        name="ad-side"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        checked={adPosition === "down"}
                        onChange={() => setAdPosition("down")} // value 대신 직접 boolean 값 설정
                      />
                      <label htmlFor="ad-down" className="text-sm break-keep">
                        상세내용 아래로
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold py-1">
              <div className="lg:w-fit min-w-[84px] py-1">광고 상세내용</div>
              <div className="lg:w-fit min-w-[48px] text-success py-1"></div>
              <div className="grid grid-cols-1 gap-y-1 bg-white">
                <div className="w-full relative flex flex-row justify-start gap-x-1 font-normal">
                  <button
                    className={`p-2 ${
                      !isHtml
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => setIsHtml(false)}
                  >
                    에디터 사용
                  </button>
                  <button
                    className={`p-2 ${
                      isHtml
                        ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                    }`}
                    onClick={() => {
                      const image = imgChk(detailContent);
                      if (image) {
                        const confirm = window.confirm(
                          "에디터에서 이미지 등록을 한 경우 내용이 매우 길어질 수 있습니다\nHTML모드로 변경하시겠습니까?"
                        );
                        if (confirm) {
                          setIsHtml(true);
                        } else {
                          return false;
                        }
                      } else {
                        setIsHtml(true);
                      }
                    }}
                  >
                    HTML 입력
                  </button>
                </div>
                {!isHtml ? (
                  <div className="flex flex-row justify-start gap-x-2 h-fit">
                    <Editor
                      value={detailContent}
                      setValue={setDetailContent}
                      modules={modules}
                      formats={formats}
                    />
                    <div className="flex flex-col"></div>
                  </div>
                ) : (
                  <div className="flex flex-row justify-start gap-x-1 h-fit">
                    <textarea
                      className="htmleditor border p-1"
                      value={detailContent || ""}
                      onChange={e => setDetailContent(e.currentTarget.value)}
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold">
              <div className="lg:w-fit min-w-[84px] py-4">상세이미지</div>
              <div className="lg:w-fit min-w-[48px] text-success py-4"></div>
              <div className="w-full bg-[#eaeaea] border border-[#ccc] rounded divide-y">
                <div className="flex flex-row justify-start gap-x-1 text-sm font-bold py-1 px-2">
                  <div className="flex flex-wrap gap-y-4 gap-x-4 bg-white w-full px-2 py-1">
                    <DetailUploadImg
                      title={"상세이미지"}
                      type={"detail"}
                      files={detailImages}
                      setFiles={setDetailImages}
                      detailContent={detailContent}
                      setDetailContent={setDetailContent}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              data="유료상품"
              className="flex flex-row justify-start gap-x-1 text-sm font-bold"
            >
              <div className="lg:w-fit min-w-[84px] py-2">유료상품</div>
              <div className="lg:w-fit min-w-[48px] text-success py-2">
                필수
              </div>
              <div className="grid grid-cols-1">
                <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                  {grades.map((gra, idx) => (
                    <div
                      data={`"유료상품-${idx}"`}
                      className="flex items-center gap-x-2"
                      key={idx}
                    >
                      <input
                        id={`grade-${idx}`}
                        type="radio"
                        value={gra.value}
                        name={`grade-${idx}`}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        checked={grade === String(gra.value)}
                        onChange={handleGradeChange}
                      />
                      <label htmlFor={`grade-${idx}`} className="text-sm">
                        {gra.txt}
                        {gra.des ? ` : ${gra.des}` : ""}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                  <div data="포커스광고" className="flex items-center gap-x-2">
                    <input
                      id="focus"
                      type="checkbox"
                      name="focus"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={focus}
                      onChange={handleFocusChange}
                    />
                    <label htmlFor="focus" className="text-sm">
                      포커스 광고 : 메인 중단, 검색결과 노출
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          data="예약등록"
          className="grid grid-cols-1 gap-y-[10px] px-5 bg-[#eaeaea] py-5"
        >
          <div className="grid grid-cols-1 gap-y-[50px]">
            <div className="flex flex-row justify-start gap-x-1 text-sm font-bold px-5 py-2 bg-white border border-[#ccc]">
              <div className="w-full grid grid-cols-1 gap-y-2">
                <div className="w-full relative flex flex-row justify-start gap-x-[50px] gap-y-3 flex-wrap font-normal py-2">
                  <h3 className="py-[10px] font-extra text-black">예약등록</h3>
                  <div data="바로등록" className="flex items-center gap-x-2">
                    <input
                      id="no-reserve"
                      type="radio"
                      name="reserve"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={!reserve}
                      onChange={() => setReserve(false)} // value 대신 직접 boolean 값 설정
                    />
                    <label htmlFor="no-reserve" className="text-sm">
                      바로 등록
                    </label>
                  </div>
                  <div data="예약일" className="flex items-center gap-x-2">
                    <input
                      id="yes-reserve"
                      type="radio"
                      name="reserve"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={reserve}
                      onChange={() => setReserve(true)} // value 대신 직접 boolean 값 설정
                    />
                    <label htmlFor="yes-reserve" className="text-sm break-keep">
                      예약 등록
                    </label>
                    <input
                      type="text"
                      className="w-fit min-w-[100px] py-1 px-2 border border-[#ccc] rounded-sm"
                      defaultValue={
                        reserveDate
                          ? dayjs(reserveDate).format("YYYY-MM-DD")
                          : ""
                      }
                      disabled={!reserve}
                    />
                  </div>
                </div>
                {reserve ? (
                  <div className="bg-[#eaeaea] border border-[#ccc] rounded divide-y w-fit">
                    <div className="flex flex-row justify-start gap-x-1 text-sm font-bold pr-4">
                      <div className="lg:w-fit text-center min-w-[120px] pl-2 py-4 flex flex-col justify-center">
                        예약일 선택
                      </div>
                      <div className="pl-2 py-4">
                        <div className="bg-white w-fit border border-[#ccc]">
                          <DayPicker
                            mode="single"
                            timeZone="Asia/Seoul"
                            locale={ko}
                            numberOfMonths={2}
                            selected={reserveDate}
                            onSelect={setReserveDate}
                            classNames={{
                              today: `bg-green-100 rounded-full`, // Add a border to today's date
                              selected: `bg-blue-100 rounded-full important`, // Highlight the selected day
                              root: `${defaultClassNames.root} p-5`, // Add a shadow to the root element
                              caption_label: `${defaultClassNames.caption_label}`,
                              chevron: `${defaultClassNames.chevron} fill-amber-500`, // Change the color of the chevron
                              months: `${defaultClassNames.months} grid grid-cols-2 gap-x-2`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 right-0 w-screen flex justify-center gap-x-4 py-4 bg-white border-t border-[#ccc]">
          <button
            className="border border-[#ccc] rounded text-lg hover:bg-gray-50 py-2 px-5"
            onClick={() => reset()}
          >
            초기화
          </button>
          <button
            className="border border-primary bg-primary text-white hover:bg-opacity-80 rounded py-2 px-5 text-lg"
            onClick={() => submit("norepeat")}
          >
            공고 {!aid ? "등록" : reinput !== "y" ? "수정" : "재등록"}
          </button>

          <button
            className="border border-primary bg-primary text-white hover:bg-opacity-80 rounded py-2 px-5 text-lg"
            onClick={() => submit("repeat")}
          >
            공고 연속등록
          </button>
        </div>
      </div>
      <Modal
        modalOn={modalOn}
        setModalOn={setModalOn}
        modalType={modalType}
        setModalType={setModalType}
        areaA={areaA}
        areaB={areaB}
        areaC={areaC}
        setAreaA={setAreaA}
        setAreaB={setAreaB}
        setAreaC={setAreaC}
      />
      <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode
              onClose={closePostCode}
              setAreaA={setAreaA}
              setZipCode={setZipCode}
              setAddressA={setAddressA}
            />
          </PopupDom>
        )}
      </div>
      {loading && (
        <div className="bg-white bg-opacity-55 w-[100vw] h-[100vh] fixed top-0 left-0 overflow-hidden z-[9999999999]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit min-w-[50px] text-center flex flex-col justify-center z-[10000000000]">
            <div className="loader" />
            <span className="absolute w-[50vw] bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
              {loadMsg}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default AdInput2;
