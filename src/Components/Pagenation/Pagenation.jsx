import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

function Pagenation(props) {
  const [next, setNext] = useState("");
  const [prev, setPrev] = useState("");
  const [next10, setNext10] = useState("");
  const [prev10, setPrev10] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [pageList, setPageList] = useState([]);
  const thisLocation = useLocation();
  const navi = useNavigate();
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page ? Number(parsed.page) : 1;
  const size = parsed.size ? Number(parsed.size) : 20;
  const status = parsed.status || null;
  const keyword = parsed.keyword || null;

  useEffect(() => {
    getUrls(page, props.last);
    //eslint-disable-next-line
  }, [props.last]);

  const handleSizeChange = e => {
    const size = e.target.value;
    let url = thisLocation.pathname;
    if (size) {
      if (size !== "20") url = url + `?page=1&size=${size}`;
    }
    navi(url);
  };

  const getUrls = async (page, last) => {
    const url = thisLocation.pathname;
    let nextUrl = url + `?page=${page + 1}`;
    let prevUrl = url + `?page=${page - 1}`;
    let next10Url = url + `?page=${page + 10}`;
    let prev10Url = url + `?page=${page - 10}`;
    let firstUrl = url + `?page=1`;
    let lastUrl = url + `?page=${last}`;

    setNext(chkUrl(nextUrl));
    setPrev(chkUrl(prevUrl));
    setNext10(chkUrl(next10Url));
    setPrev10(chkUrl(prev10Url));
    setFirst(chkUrl(firstUrl));
    setLast(chkUrl(lastUrl));
    let urls = [];
    if (last > 5 && last > page + 2) {
      if (page === 1) {
        await urls.push({ num: page, path: chkUrl(url + `?page=${page}`) });
        await urls.push({
          num: page + 1,
          path: chkUrl(url + `?page=${page + 1}`),
        });
        await urls.push({
          num: page + 2,
          path: chkUrl(url + `?page=${page + 2}`),
        });
        await urls.push({
          num: page + 3,
          path: chkUrl(url + `?page=${page + 3}`),
        });
        await urls.push({
          num: page + 4,
          path: chkUrl(url + `?page=${page + 4}`),
        });
      } else if (page === 2) {
        await urls.push({
          num: page - 1,
          path: chkUrl(url + `?page=${page - 1}`),
        });
        await urls.push({ num: page, path: chkUrl(url + `?page=${page}`) });
        await urls.push({
          num: page + 1,
          path: chkUrl(url + `?page=${page + 1}`),
        });
        await urls.push({
          num: page + 2,
          path: chkUrl(url + `?page=${page + 2}`),
        });
        await urls.push({
          num: page + 3,
          path: chkUrl(url + `?page=${page + 3}`),
        });
      } else {
        await urls.push({
          num: page - 2,
          path: chkUrl(url + `?page=${page - 2}`),
        });
        await urls.push({
          num: page - 1,
          path: chkUrl(url + `?page=${page - 1}`),
        });
        await urls.push({ num: page, path: chkUrl(url + `?page=${page}`) });
        await urls.push({
          num: page + 1,
          path: chkUrl(url + `?page=${page + 1}`),
        });
        await urls.push({
          num: page + 2,
          path: chkUrl(url + `?page=${page + 2}`),
        });
      }
    } else {
      last - 4 > 0 &&
        (await urls.push({
          num: last - 4,
          path: chkUrl(url + `?page=${last - 4}`),
        }));
      last - 3 > 0 &&
        (await urls.push({
          num: last - 3,
          path: chkUrl(url + `?page=${last - 3}`),
        }));
      last - 2 > 0 &&
        (await urls.push({
          num: last - 2,
          path: chkUrl(url + `?page=${last - 2}`),
        }));
      last - 1 > 0 &&
        (await urls.push({
          num: last - 1,
          path: chkUrl(url + `?page=${last - 1}`),
        }));
      await urls.push({ num: last, path: chkUrl(url + `?page=${last}`) });
    }
    setPageList(urls);
  };

  //쿼리스트링 체크
  const chkUrl = url => {
    let formattedUrl = url;
    if (parsed.size) {
      formattedUrl = formattedUrl + `&size=${parsed.size}`;
    }
    if (status) {
      formattedUrl = formattedUrl + `&status=${status}`;
    }
    if (keyword) {
      formattedUrl = formattedUrl + `&keyword=${status}`;
    }
    return formattedUrl;
  };
  return (
    <>
      <div className="w-[90%] mx-auto flex justify-between  mt-4">
        <div>
          <select
            value={size}
            className="p-2 bg-white border"
            onChange={handleSizeChange}
          >
            <option value="20">20개씩 보기</option>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
          </select>
        </div>
        <div className="flex justify-center gap-x-2">
          {page > 1 && (
            <Link
              to={first}
              title="처음으로"
              className="p-2 bg-white border rounded-sm hover:bg-gray-100"
            >
              처음으로
            </Link>
          )}
          {page > 10 && (
            <Link
              to={prev10}
              title="10페이지 앞으로"
              className="p-2 bg-white border rounded-sm hover:bg-gray-100"
            >
              &lt;&lt;
            </Link>
          )}
          {page > 1 && (
            <Link
              to={prev}
              title="이전 페이지로"
              className="p-2 bg-white border rounded-sm hover:bg-gray-100"
            >
              &lt;
            </Link>
          )}
          {pageList.length > 0 && (
            <>
              {pageList.map((pages, idx) => (
                <Link
                  to={pages.path}
                  title={`${pages.num}페이지로`}
                  className={`p-2 ${
                    page === pages.num ? "bg-blue-100" : "bg-white"
                  }bg-white border rounded-sm hover:bg-gray-100`}
                  key={idx}
                >
                  {pages.num}
                </Link>
              ))}
            </>
          )}
          {props.last > page && (
            <Link
              to={next}
              title="다음 페이지로"
              className="p-2 bg-white border rounded-sm hover:bg-gray-100"
            >
              &gt;
            </Link>
          )}
          {props.last > page + 9 && (
            <Link
              to={next10}
              title="10페이지 뒤로"
              className="p-2 bg-white border rounded-sm hover:bg-gray-100"
            >
              &gt;&gt;
            </Link>
          )}
          {props.last > page && (
            <Link
              to={last}
              title="마지막 페이지로"
              className="p-2 bg-white border rounded-sm hover:bg-gray-100"
            >
              마지막으로
            </Link>
          )}
        </div>
        <div />
      </div>
    </>
  );
}

export default Pagenation;
