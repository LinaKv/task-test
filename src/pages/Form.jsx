import React from "react";
import { useState, useEffect } from "react";
import SelectForm from "../components/SelectForm";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import axios from "axios";
import { toast } from "react-toastify";

function Form() {
  let isAmountCorrect = true;
  let amountFormat;

  const [loading, setLoading] = useState(true);
  const [dataFromChild, setDataFromChild] = useState({
    from: "",
    to: "",
    currency: "",
    amount: "",
  });
  const [responseData, setResponseData] = useState({
    currencyResp: null,
    usersResp: null,
  });
  const { from, to, currency, amount } = dataFromChild;

  const handleDataFromChild = (data) => {
    if (data.type === "from" && to.name) {
      const currenciesNow = Object.keys(data.value.currencies)[0];
      const newFromUser = data.value.name;
      setDataFromChild((prevState) => ({
        ...prevState,
        [data.type]: data.value,
        to: usersResp.find((el) => el.name !== newFromUser && Object.keys(el.currencies).includes(currenciesNow)),
        currency: currenciesNow,
      }));
    } else {
      setDataFromChild((prevState) => ({
        ...prevState,
        [data.type]: data.value,
      }));
    }
  };
  const onClick = (e) => {
    setDataFromChild((prevState) => ({
      ...prevState,
      [e.type]: e[e.type],
      to: usersResp.find((el) => el.name !== from.name && Object.keys(el.currencies).includes(e[e.type])),
    }));
  };

  async function fetchData() {
    try {
      const currenciesPromise = axios.get("http://91.193.43.93:3000/currencies");
      const usersPromise = axios.get("http://91.193.43.93:3000/users");

      const [currenciesResponse, usersResponse] = await Promise.all([currenciesPromise, usersPromise]);

      setResponseData({
        currencyResp: currenciesResponse.data,
        usersResp: usersResponse.data,
      });
    } catch (error) {
      toast.error(`Error! And we don't know why but work on it :(`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const { currencyResp, usersResp } = responseData;

  let toOptions = usersResp;
  let currencyOptions = [];

  if (from.name) {
    currencyOptions = Object.keys(from.currencies);
    toOptions = usersResp.filter((el) => el.name !== from.name && Object.keys(el.currencies).includes(currency));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const currencyId = currencyResp.filter((el) => el.code === currency)[0].id;
    const requestData = {
      currencyId: currencyId,
      fromUserId: from.id,
      toUserId: to.id,
      amount: amount,
    };

    axios
      .post("http://91.193.43.93:3000/transfers/make-transfer", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        toast.success(`Success! ${amountFormat} were sent from ${from.name} to ${to.name}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        toast.error(`Error! ${amountFormat} were not sent from ${from.name} to ${to.name}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .finally(() => {
        setLoading(false);
        setDataFromChild({
          from: "",
          to: "",
          currency: "",
          amount: "",
        });
      });
  };

  if (amount && from.name) {
    const amountPersonHas = +from.currencies[currency];
    if (+amount > amountPersonHas || amount[0] === "0") {
      isAmountCorrect = false;
    } else {
      isAmountCorrect = true;
    }
  }

  if (amount && amount[0] !== "0" && currency) {
    const decimals = currencyResp.filter((el) => el.code === currency)[0]?.decimals || 2;
    amountFormat = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency,
      decimalScale: decimals,
    }).format(amount);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <header className='flex flex-col items-center justify-center mb-6'>
          <h1 className='font-bold text-2xl mb-6 '>Welcome</h1>
        </header>

        <form onSubmit={onSubmit}>
          <div className='mb-3'>
            <p>From</p>
            <SelectForm
              options={usersResp}
              onData={handleDataFromChild}
              type={"from"}
            />
          </div>

          <div className='mb-3'>
            <p>Currency</p>
            <select
              onClick={(e) => (e.target.value ? onClick(JSON.parse(e.target.value)) : "")}
              className='select select-bordered w-full max-w-xs'
            >
              {currencyOptions.length ? (
                <>
                  <option
                    value=''
                    disabled
                    selected
                  >
                    Select an option
                  </option>
                  {currencyOptions.map((el, index) => (
                    <option
                      value={JSON.stringify({ type: "currency", currency: el })}
                      key={index}
                      id='currency'
                    >
                      {el}
                    </option>
                  ))}
                </>
              ) : (
                <option
                  value=''
                  disabled
                  selected
                >
                  Select "From" first
                </option>
              )}
            </select>
          </div>

          <div className='mb-3'>
            <p>To</p>
            <SelectForm
              options={toOptions}
              onData={handleDataFromChild}
              type='to'
              isNewTo={to.name}
            />
          </div>

          <div className='mb-3'>
            Amount
            <Input
              onData={handleDataFromChild}
              type={"amount"}
              isAmountCorrect={isAmountCorrect}
              amountFormat={amountFormat}
            />
          </div>

          <button
            className='btn btn-primary w-full mt-6'
            disabled={from !== "" && to !== "" && isAmountCorrect && amount !== "" ? "" : "disabled"}
          >
            Transfers
          </button>
        </form>
      </div>
    </>
  );
}

export default Form;
