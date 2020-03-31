import React, { Fragment, useState, useEffect, useRef } from 'react';

const STANDARD_DEVIATION = 20;
const DIZZY_ANIMATION_TIME = 400; // 400ms

const getRandomNumber = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

const Dizzy = props => {
  const {
    counter,
    startX,
    startY,
    endX,
    endY,
    startScale,
    type,
  } = props;

  const [style, setStyle] = useState({
    top: startY,
    left: startX,
    transform: `translate(0px, 0px) scale(${startScale})`,
  });

  const requestRef = useRef();

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  let start;

  const animate = time => {
    if (!start) {
      start = time;
    }

    const progress = time - start;
    const x = endX * progress / DIZZY_ANIMATION_TIME;
    const y = endY * progress / DIZZY_ANIMATION_TIME;
    const scale = startScale + ((0 - startScale) * (progress / DIZZY_ANIMATION_TIME));
    
    // console.log({
    //   progress,
    //   x,
    //   y,
    //   scale
    // });

    setStyle({
      ...style,
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
    });

    if (progress < DIZZY_ANIMATION_TIME) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }

  return (<div key={`dizzy-${counter}`} className={`ib-bg-dizzy ${type}`} style={style} />);
}

const DizzyEffect = ({ ibRef }) => {
  const [ibPosition, setIbPosition] = useState(null);
  let counter = 0;
  
  useEffect(() => {
    updateAnchors();
    window.addEventListener('resize', updateAnchors);
    return () => window.removeEventListener('resize', updateAnchors);
  }, []);

  const updateAnchors = () => {
    const ibRect = ibRef && ibRef.current.getBoundingClientRect();
    const { left, right, top, bottom } = ibRect;
    setIbPosition({
      left,
      right,
      top,
      bottom,
    });
  }

  const createDizzy = () => {
    if (!ibPosition) {
      return;
    }

    const { left, right, top, bottom } = ibPosition;
    const { x: startX, y: startY } = getRandomStartPosition(left, right, top, bottom);
    const { x: endX, y: endY } = getEndPosition();
    const type = getRandomType();
    const startScale = getRandomStartScale();

    const props = {
      counter,
      startX,
      startY,
      endX,
      endY,
      startScale,
      type,
    };

    return <Dizzy {...props} />;
  }

  const getRandomType = () => {
    return Math.random() >= 0.5 ? 'full' : 'stroke';
  }

  const getRandomStartScale = () => {
    return Math.random() + 0.5;
  }

  const getRandomStartPosition = (left, right, top, bottom) => {
    const deviation = getRandomNumber(0, STANDARD_DEVIATION);
    let x;
    let y;

    if (Math.random() >= 0.5) {
      const fixed = Math.random() >= 0.5 ? left : right;
      const random = getRandomNumber(top, bottom);
      x = fixed - deviation;
      y = random - deviation;
    } else {
      const fixed = Math.random() >= 0.5 ? top : bottom;
      const random = getRandomNumber(left, right);
      x = random - deviation;
      y = fixed - deviation;
    }

    return { x, y };
  };

  const getEndPosition = () => {
    const angle = Math.floor(Math.random() * 359) + 1;
    const x = (Math.cos(angle) * 3) * 16; // em to px
    const y = (Math.sin(angle) * 3) * 16; // em to px
    return { x, y };
  }

  let dizzies = createDizzy();

  return (
    <Fragment>
      {dizzies}
    </Fragment>
  );
};

export default DizzyEffect;