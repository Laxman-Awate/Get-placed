import React from 'react';
import { Link } from '../../context/RouteContext';

export function Logo() {
  return <Link className="logo" href="#top" aria-label="PlacePro home"><span className="logo-mark">⌂</span><span>Place<span>Pro</span></span></Link>;
}

export function Arrow() { return <span aria-hidden="true">↗</span>; }
