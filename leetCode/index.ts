/**
 Do not return anything, modify nums1 in-place instead.
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    if(n === 0){
        return;
    }
    if(m === 0){
        for(let i = 0 ; i < n; i++ ){
            nums1[i] = nums2[i];
        }
        return;
	}
	
	for (let i = n + m - 1; i >= 0; i--){
		if(n===0 && m === 0){
			break;;
		}
		if (m === 0) {
			nums1[i] = nums2[n-1];
			n--;
			continue;
		}
		if (n === 0) {
			nums1[i] = nums1[m-1];
			m--;
			continue;
		}
		if (nums2[n - 1] >= nums1[m - 1]) {
			nums1[i] = nums2[n - 1];
			n--;
			continue;
		}  
		if (nums2[n - 1] < nums1[m - 1]) {
			nums1[i] = nums1[m - 1];
			m--;			
		}
    }
};


let nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2,5,6], n = 3;
merge(nums1, m, nums2, n);
console.log(nums1);

nums1 = [1], m = 1, nums2 = [], n = 0
merge(nums1, m, nums2, n);
console.log(nums1);

nums1 = [0], m = 0, nums2 = [1], n = 1
merge(nums1, m, nums2, n);
console.log(nums1);
