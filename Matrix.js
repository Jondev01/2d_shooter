class Matrix{
  constructor(rows, cols){
    this.rows = rows;
    this.cols = cols;
    this.matrix = new Array(rows*cols);
    //random entries between two and 1
    for(let i=0; i<this.matrix.length; i++){
      this.matrix[i] = random(2)-1;
    }
  }
  getElement(i, j){
    return this.matrix[i*this.cols+j];
  }
  setElement(i, j, a){
    this.matrix[i*this.cols+j] = a;
  }

  multiply(m2){
    if(this.cols !== m2.rows)
      return undefined;
    let m = new Matrix(this.rows, m2.cols);
    for(let i=0; i<m.rows; i++){
      for(let j=0; j<m.cols; j++){
        let el = 0;
        for(let k=0; k<m2.rows; k++){
          el += this.getElement(i,k)*m2.getElement(k,j);
        }
        m.setElement(i,j, el);
      }
    }
    return m;
  }
  add(m2){
    if(this.rows != m2.rows || this.cols != m2.cols)
      return undefined;
    let m = new Matrix(this.rows, this.cols);
    for(let i = 0; i<this.rows; i++){
      for(let j = 0; j<this.cols; j++){
        let el = this.getElement(i,j) + m2.getElement(i,j);
        m.setElement(i,j,el);
      }
    }
    return m;
  }

  addBias(){
    if(this.cols !== 1){
      console.log("Error: couldn't add bias");
      return undefined;
    }
    let m = new Matrix(this.rows+1, 1);
    //Copy column matrix
    for(let i=0; i<this.rows; i++){
      let el = this.getElement(i, 0);
      m.setElement(i, 0, el);
    }
    //Bias: Add a one at the end
    m.setElement(this.rows, 0, 1);
    return m;
  }

  mutate(rate){
  //  console.log("matrix this");
  //  console.log(this);
    let m = new Matrix(this.rows, this.cols);
    for(let i=0; i<this.rows; i++){
      for(let j=0; j<this.cols; j++){
        if(random(1)<rate){
          let el = this.getElement(i,j) + random(2)-1;
          if(el > 1)
            el = 1;
          else if(el < -1)
            el = -1;
          m.setElement(i,j, el);
        }
      }
    }
    return m;
  }

  crossover(partner){
    let i0 = floor(random(this.rows));
    let j0 = floor(random(this.cols));
    let m = new Matrix(this.rows, this.cols);
    for(let i=0; i<this.rows; i++){
      for(let j=0; j<this.cols; j++){
        let el;
        if(i<i0 && j<j0)
          el = this.getElement(i,j);
        else el = partner.getElement(i,j);
        m.setElement(i,j,el);
      }
    }
    return m;
  }

  static arrayToMatrix(arr){
    let m = new Matrix(arr.length, 1);
    for(let i=0; i<arr.length; i++){
      m.setElement(i,0, arr[i]);
    }
    return m;
  }

  static matrixToArray(m){
    if(m.cols!==1)
      return undefined;
    let arr = new Array(m.rows);
    for(let i=0; i<m.rows; i++){
      arr[i] = m.getElement(i,0);
    }
    return arr;
  }
  clone(){
    let clone = new Matrix(this.rows, this.cols);
    for(let i=0; i<clone.rows; i++){
      for(let j=0; j<clone.cols; j++){
        let el = this.getElement(i,j);
        clone.setElement(i,j,el);
      }
    }
    return clone;
  }

  static load(data){
    let m = new Matrix(data.rows, data.cols);
    m.matrix = data.matrix.slice();
    return m;
  }
}
