import * as React from 'react';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: 'pointer',
  fill: '#d00',
  stroke: 'none'
};

const selection = {
  select: {cursor: 'pointer', fill: '#5171d1', stroke: 'none'},
  result: {cursor: 'pointer', fill: '#00dd51', stroke: 'none'},
  plannerview: {cursor: 'pointer', fill: '#d00', stroke: 'none'},
  POST: {cursor: 'pointer', fill: '#d00', stroke: 'none'},
  planoverview: {cursor: 'pointer', fill: '#42e3d7', stroke: 'none'}

}

const textStyle = {
  fontSize: 9,
  fontWeight: 'bold',
  fill: '#fff',
  textAlign: 'center',
};



function Pin({size = 25, index, type}) {
  return (
    <svg height={size} viewBox="0 0 24 24" style={selection[type]}>
      <path d={ICON} />
      {(type !== "select" && type !== "POST") && <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={textStyle}>{index + 1}</text>}
    </svg>
  );
}

export default React.memo(Pin);