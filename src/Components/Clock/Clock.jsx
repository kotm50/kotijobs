function Clock(props) {
  return (
    <div className="bg-lime-200 font-extra fixed w-fit h-fit px-4 py-2 top-4 right-4 z-[100000000] rounded-lg">
      {props.time}
    </div>
  );
}

export default Clock;
