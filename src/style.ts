const style = `.cjs-button-wrapper {
  padding: 5px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cjs-button-container {
  width: auto;
}

.cjs-button {
  color: var(--gjs-font-color);
  fill: var(--gjs-font-color);
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  position: static;
  opacity: 0.75;
  padding: 0;
  width: 18px;
  height: 18px;
}

.cjs-button-disabled {
  opacity: 0.2 !important;
  cursor: auto !important;
}`;
export default style;
