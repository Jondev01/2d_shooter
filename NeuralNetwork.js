class NeuralNetwork{
  constructor(input, hidden, output){
    this.nInput = input;
    this.nHidden = hidden;
    this.nOutput = output;
    //weights
    //+1 b/c each layer has one bias node
    this.w_ih = new Matrix(hidden, input+1)
    this.w_hh = new Matrix(hidden, hidden+1);
    this.w_ho = new Matrix(output, hidden+1);
    //bias initialized to 0
    /*this.b_i = new Matrix(input, 1);
    this.b_i.matrix.map(x => 0);
    this.b_h = new Matrix(hidden, 1);
    this.b_h.matrix.map(x => 0);
    this.b_o = new Matrix(hidden, 1);
    this.b_o.matrix.map(x => 0);*/
  }

  nextLayer(input, weights){
    return weights.multiply(input.addBias());
  }

  calculateOutput(input){
    input = Matrix.arrayToMatrix(input);
    let h1 = this.nextLayer(input, this.w_ih);
    h1 = this.activateLayer(h1);
    let h2 = this.nextLayer(h1, this.w_hh);
    h2 = this.activateLayer(h2);
    let output = Matrix.matrixToArray(this.nextLayer(h2, this.w_ho));
    return output;
  }

  activateLayer(layer){
    let m = new Matrix(layer.rows, 1);
    for(let i=0; i<m.rows; i++){
      let el = 1.0/(1+Math.exp(-layer.getElement(i,0)));
      m.setElement(i, 0, el);
    }
    return m;
  }

  mutate(rate){
    let n = new NeuralNetwork(this.nInput, this.nHidden, this.nOutput);
    n.w_ih = this.w_ih.mutate(rate);
    n.w_hh = this.w_hh.mutate(rate);
    n.w_ho = this.w_ho.mutate(rate);
    /*this.b_i.mutate(rate);
    this.b_h.mutate(rate);
    this.b_o.mutate(rate);*/
    return n;
  }

  crossover(partner){
      let child = new NeuralNetwork(this.nInput, this.nHidden, this.nOutput);
      child.w_ih = this.w_ih.crossover(partner.w_ih);
      child.w_ho = this.w_ho.crossover(partner.w_ho);
      child.w_hh = this.w_hh.crossover(partner.w_ho);
      /*child.b_i = this.b_i.crossover(partner.b_i);
      child.b_h = this.b_h.crossover(partner.b_h);
      child.b_o = this.b_o.crossover(partner.b_h);*/
      return child;
  }

  clone(){
    let clone = new NeuralNetwork(this.nInput, this.nHidden, this.nOutput);
    clone.w_ih = this.w_ih.clone();
    clone.w_ho = this.w_ho.clone();
    clone.w_hh = this.w_hh.clone();
    /*clone.b_i = this.b_i.clone();
    clone.b_h = this.b_h.clone();
    clone.b_o = this.b_o.clone();*/
    return clone;
  }

  static load(data){
    if(typeof(data) == "string")
      data = JSON.parse(data);
    let n = new NeuralNetwork(data.nInput, data.nHidden, data.nOutput);
    n.w_ih = Matrix.load(data.w_ih);
    n.w_hh = Matrix.load(data.w_hh);
    n.w_ho = Matrix.load(data.w_ho);
    /*n.b_i = Matrix.load(data.b_i);
    n.b_h = Matrix.load(data.b_h);
    n.b_o = Matrix.load(data.b_o);*/
    return n;
  }
}
