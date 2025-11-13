import assert from "assert";

function removeDuplicates(nums: number[]): number {
	if (nums.length === 0 || 1 === nums.length) {
		return nums.length;
	}
	let i = 0, j = 0;
	while (j < nums.length) {
		if (nums[i] === nums[j]) {
			j++;
			continue;
		}
		if (j >= nums.length) {
			break;
		}
		if (i != j) {
			nums[i + 1] = nums[j];
			i++;
			j++;
		}		
	}
	return i+1;
};

function removeDuplicatesSet(nums: number[]): number {
	if (nums.length === 0 || 1 === nums.length) {
		return nums.length;
	}
	let uniqueNums = new Set<number>();
	let i = 0;
	for (let i = 0; i <nums.length;i++) {
		if (!uniqueNums.has(nums[i])) {
			uniqueNums.add(nums[i]);
		}
	}
	
	const newArr:number[] = [...uniqueNums];
	
	for (let i = 0; i < newArr.length; i++){
		nums[i] = newArr[i];
	}
	return newArr.length;
};


let nums = [1, 1, 2];
let expectedNums = [1, 2];
let k = removeDuplicates(nums); // Calls your implementation

assert(k === expectedNums.length);
for (let i = 0; i < k; i++) {
    assert(nums[i] == expectedNums[i]);
}

console.log(`k=${k}`);

nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
expectedNums = [0, 1, 2, 3, 4];
k = removeDuplicates(nums); // Calls your implementation

assert(k === expectedNums.length);
for (let i = 0; i < k; i++) {
	assert(nums[i] == expectedNums[i]);
}

console.log(`k=${k}`);

nums = [ 1, 2, 3]
expectedNums = [1, 2, 3];
k = removeDuplicates(nums); // Calls your implementation

assert(k === expectedNums.length);
for (let i = 0; i < k; i++) {
	assert(nums[i] == expectedNums[i]);
}

console.log(`k=${k}`);

nums = [1, 1]
expectedNums = [1];
k = removeDuplicates(nums); // Calls your implementation

assert(k === expectedNums.length);
for (let i = 0; i < k; i++) {
	assert(nums[i] == expectedNums[i]);
}

console.log(`k=${k}`);
