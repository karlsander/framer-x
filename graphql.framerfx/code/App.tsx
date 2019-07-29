import { Override, Data } from "framer";
import { useState } from "react";
import { useSpring } from "react-spring";
import { Logo, Circle } from "./canvas";

const data = Data({
  rotate: 0,
  rotateY: 0,
  toggle: true
});

export function Rotate(): Override {
  return {
    animate: { rotate: data.rotate },
    onTap() {
      data.rotate = data.rotate + 90;
    }
  };
}

export function Trip(): Override {
  const [run, setRun] = useState(false);

  return {
    onTap: () => {
      setRun(r => !r);
    },
    opacity: run ? 1 : 0.5
  };
}
