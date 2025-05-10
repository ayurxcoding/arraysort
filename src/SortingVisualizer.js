import React, { useState, useEffect, useRef } from 'react';
import './SortingVisualizer.css';

const ALGORITHMS = {
  bubble: "Bubble Sort: Repeatedly steps through the list, compares adjacent items and swaps them if they are in the wrong order.",
  selection: "Selection Sort: Finds the minimum element and puts it at the beginning, repeating for each index.",
  insertion: "Insertion Sort: Builds the sorted array one item at a time by comparing and inserting elements.",
  merge: "Merge Sort: Divides the array into halves, sorts them recursively, and merges the sorted halves.",
  quick: "Quick Sort: Selects a pivot and partitions the array around the pivot, recursively sorting the subarrays.",
};

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sorting, setSorting] = useState(false);
  const [description, setDescription] = useState('');
  const stopRef = useRef(false);

  const parseInput = () => {
    const values = inputValue.split(',').map(Number).filter(n => !isNaN(n));
    setArray(values);
  };

  const reset = () => {
    setSorting(false);
    stopRef.current = false;
    setDescription('');
    parseInput();
  };

  const stop = () => {
    stopRef.current = true;
    setSorting(false);
  };

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  const animateArray = async (newArr) => {
    setArray([...newArr]);
    await sleep(100);
  };

  // Sorting algorithms
  const bubbleSort = async () => {
    setSorting(true);
    setDescription(ALGORITHMS.bubble);
    const arr = [...array];
    for (let i = 0; i < arr.length && !stopRef.current; i++) {
      for (let j = 0; j < arr.length - i - 1 && !stopRef.current; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          await animateArray(arr);
        }
      }
    }
    setSorting(false);
  };

  const selectionSort = async () => {
    setSorting(true);
    setDescription(ALGORITHMS.selection);
    const arr = [...array];
    for (let i = 0; i < arr.length && !stopRef.current; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length && !stopRef.current; j++) {
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      await animateArray(arr);
    }
    setSorting(false);
  };

  const insertionSort = async () => {
    setSorting(true);
    setDescription(ALGORITHMS.insertion);
    const arr = [...array];
    for (let i = 1; i < arr.length && !stopRef.current; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key && !stopRef.current) {
        arr[j + 1] = arr[j];
        j = j - 1;
        await animateArray(arr);
      }
      arr[j + 1] = key;
      await animateArray(arr);
    }
    setSorting(false);
  };

  const mergeSort = async () => {
    setSorting(true);
    setDescription(ALGORITHMS.merge);
    const arr = [...array];

    async function mergeSortHelper(arr, l, r) {
      if (l >= r || stopRef.current) return;

      const m = Math.floor((l + r) / 2);
      await mergeSortHelper(arr, l, m);
      await mergeSortHelper(arr, m + 1, r);
      await merge(arr, l, m, r);
    }

    async function merge(arr, l, m, r) {
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;

      while (i < left.length && j < right.length && !stopRef.current) {
        if (left[i] <= right[j]) {
          arr[k++] = left[i++];
        } else {
          arr[k++] = right[j++];
        }
        await animateArray(arr);
      }
      while (i < left.length && !stopRef.current) {
        arr[k++] = left[i++];
        await animateArray(arr);
      }
      while (j < right.length && !stopRef.current) {
        arr[k++] = right[j++];
        await animateArray(arr);
      }
    }

    await mergeSortHelper(arr, 0, arr.length - 1);
    setSorting(false);
  };

  const quickSort = async () => {
    setSorting(true);
    setDescription(ALGORITHMS.quick);
    const arr = [...array];

    async function quickSortHelper(low, high) {
      if (low < high && !stopRef.current) {
        let pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    }

    async function partition(low, high) {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high && !stopRef.current; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          await animateArray(arr);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      await animateArray(arr);
      return i + 1;
    }

    await quickSortHelper(0, arr.length - 1);
    setSorting(false);
  };

  return (
    <div className="visualizer">
      <input
        type="text"
        placeholder="Enter numbers, e.g. 5,3,1"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        disabled={sorting}
      />
      <button onClick={parseInput} disabled={sorting}>Submit</button>
      <div className="bars-container">
        {array.map((value, idx) => (
          <div
            key={idx}
            className="bar"
            style={{
              height: `${value * 3}px`,
              backgroundColor: 'teal',
              width: '20px',
              margin: '0 2px'
            }}
          ></div>
        ))}
      </div>
      <div className="buttons">
        <button onClick={bubbleSort} disabled={sorting}>Bubble Sort</button>
        <button onClick={selectionSort} disabled={sorting}>Selection Sort</button>
        <button onClick={insertionSort} disabled={sorting}>Insertion Sort</button>
        <button onClick={mergeSort} disabled={sorting}>Merge Sort</button>
        <button onClick={quickSort} disabled={sorting}>Quick Sort</button>
        <button onClick={stop} disabled={!sorting}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="description">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default SortingVisualizer;
