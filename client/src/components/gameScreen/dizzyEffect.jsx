import React, { Fragment, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const DIZZY_ANIMATION_TIME = 500; // In milliseconds
const DIZZY_SPAWN_FREQUENCY = 50; // Also in milliseconds
const STANDARD_DEVIATION = 20;

const getRandomNumber = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

const Dizzy = props => {
  const {
    startX,
    startY,
    endX,
    endY,
    startScale,
    type,
    dimension,
    zIndex,
  } = props;

  const [style, setStyle] = useState({
    top: startY,
    left: startX,
    width: dimension,
    height: dimension,
    zIndex,
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

    setStyle({
      ...style,
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
    });

    if (progress < DIZZY_ANIMATION_TIME) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }
  return (<div className={`ib-bg-dizzy ${type}`} style={style} />);
}

const DizzyEffect = ({ ibRef }) => {
  const [ibPosition, setIbPosition] = useState(null); // TODO: memoize this?
  const [dizzies, setDizzies] = useState([]);

  const requestRef = useRef();

  useEffect(() => {
    updateAnchors();
    window.addEventListener('resize', updateAnchors);
    return () => window.removeEventListener('resize', updateAnchors);
  }, []);

  useEffect(() => {
    if (ibPosition) {
      createDizzies();
    }
  }, [ibPosition]);

  const updateAnchors = () => {
    if (!ibRef || !ibRef.current) {
      return;
    }
    const ibRect = ibRef.current.getBoundingClientRect();
    const { left, right, top, bottom } = ibRect;
    setIbPosition({
      left,
      right,
      top,
      bottom,
    });
  }

  let prev;
  const createDizzies = curr => {
    if(!prev || curr - prev >= DIZZY_SPAWN_FREQUENCY) {
      prev = curr;
      const props = createDizzyProps();
      if (props) {
        const key = parseInt(prev || 1, 10);
        const dizzy = <Dizzy key={key} {...props} />;
        setDizzies(prevState => {
          let prevDizzies = prevState;
          // Minus one because I'm not sure how much I can trust async accuracy
          // Don't want to remove a dizzy while it's still animating
          const dizziesToRemove = DIZZY_ANIMATION_TIME / DIZZY_SPAWN_FREQUENCY - 1;
          if (prevState.length > dizziesToRemove) {
            prevDizzies = prevDizzies.slice(dizziesToRemove);
          }
          return [...prevDizzies, dizzy];
        });
      }
    }

    requestRef.current = requestAnimationFrame(createDizzies);
  }

  const createDizzyProps = () => {
    if (!ibPosition) {
      return;
    }

    const { left, right, top, bottom } = ibPosition;
    const { x: startX, y: startY } = getRandomStartPosition(left, right, top, bottom);
    const { x: endX, y: endY } = getEndPosition();
    const type = getRandomType();
    const startScale = getRandomStartScale();
    const dimension = getRandomNumber(20, 50);
    const zIndex = getRandomNumber(5, 6);

    const props = {
      startX,
      startY,
      endX,
      endY,
      startScale,
      type,
      dimension,
      zIndex,
    };

    return props;
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

  return (
    <Fragment>{dizzies.map(d => d)}</Fragment>
  );
};

export default DizzyEffect;