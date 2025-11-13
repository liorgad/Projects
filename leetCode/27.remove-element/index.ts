// idea:

import assert from "assert";

// 2 indexes one from the beginning one from the end, get the first element that is val from the beginning and the last that is not val, replace and continue until indexes meet 
function removeElement(nums: number[], val: number): number {	
	let length = nums.length, j = nums.length - 1,i=0;
	if (0 === length) {
		return 0;
	}	
	while (i <= j){
		if(nums[j] === val) {
			j--;
			continue;
		}
		if (nums[i] === val) {
			let temp = nums[i];
			nums[i] = nums[j];
			nums[j] = temp;			
		}		
		i++;
	}
	return i;	
};

let nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2
let expectedNums = [0, 1, 4, 0, 3].sort(); // The expected answer with correct length.
                            // It is sorted with no values equaling val.
let k = removeElement(nums, val); // Calls your implementation

assert(k === expectedNums.length);
let result = nums.slice(0, k).sort();
for (let i = 0; i < expectedNums.length; i++) {
	assert(result[i] == expectedNums[i]);
}
console.log(`k=${k}`);

nums = [3, 2, 2, 3], val = 3
expectedNums = [2,2].sort(); // The expected answer with correct length.
// It is sorted with no values equaling val.
k = removeElement(nums, val); // Calls your implementation

assert(k === expectedNums.length);
result = nums.slice(0, k).sort();
// sort(nums, 0, k); // Sort the first k elements of nums
for (let i = 0; i < expectedNums.length; i++) {
	assert(result[i] == expectedNums[i]);
}
console.log(`k=${k}`);

