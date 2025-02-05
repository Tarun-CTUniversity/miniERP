import { useState, useMemo, useEffect } from "react";

const Example = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("  qw  dwedw");
  const [result,setResult] = useState(0);

  const expensiveComputation = (num) => {
    console.log("Running expensive computation...");
    for (let i = 0; i < 1000000000; i++) {} // Simulating heavy task
    return num * 2;
  };
  useEffect(()=>{
    setResult(expensiveComputation(count));
  },[count]);
  // const result = useMemo(() => expensiveComputation(count), [count]);

  return (
    <div>
      <p>Computed Value: {result}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
};


export default Example;