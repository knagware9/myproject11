package main

import (
	"fmt"
	"strconv"
//	"time"
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type Product struct {
	Batchid       string `json:"batchid"` 
	Barcode       string `json:"barcode"`     
	Manfdate       string `json:"manfdate"`
	Expdate       string `json:"expdate"`
	Prdname       string `json:"prdname"`
	Manname       string `json:"manname"` 
	Ownership     string `json:"ownership"`     
	Quantity      string `json:"quantity"`
	Weight        string  `json:"weight"`
	Temp          string `json:"temp"`     
	Price         string `json:"price"`
	Comment       string `json:"comment"`
}



//type AllBatches struct{
//	AllBatches []string
//}

//type AllBatchesDetails struct{
//	Batches []MilkProduct
//}

//type TimeTracker struct{
//	DispachedTime	string
//	ReachedTime	string
//	TPTemprature	string
//}

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

	_, args := stub.GetFunctionAndParameters()
	var A, B string    // Entities
	var Aval, Bval int // Asset holdings
	var err error

	// Initialize the chaincode
	A = args[0]
	Aval, err = strconv.Atoi(args[1])
	if err != nil {
		return shim.Error("Expecting integer value for asset holding")
	}
	B = args[2]
	Bval, err = strconv.Atoi(args[3])
	if err != nil {
		return shim.Error("Expecting integer value for asset holding")
	}
	

	// Write the state to the ledger
	err = stub.PutState(A, []byte(strconv.Itoa(Aval)))
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(B, []byte(strconv.Itoa(Bval)))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("chaincode_custom Invoke")
	function, args := stub.GetFunctionAndParameters()
	if function == "addProduct"{
		return t.addProduct(stub, args)
	} 
	if function == "move"{
		return t.move(stub, args)
	} 
	if function == "query" {
		// queries an entity state
		return t.query(stub, args)
	}

	return shim.Error("Invalid invoke function name.")
}

//func to add milk product
func (t *SimpleChaincode) addProduct(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("Add product...")
	var product Product
	var err error
	
	isExistAsBytes,_ := stub.GetState(args[0])

	if(isExistAsBytes != nil){
		return shim.Error(err.Error())
	}

	product.Batchid=args[0]
	product.Barcode=args[1]
	product.Manfdate=args[2]
	product.Expdate=args[3]
	product.Prdname =args[4]
	product.Manname=args[5]
	product.Ownership=args[6]
	product.Quantity=args[7]
	product.Weight=args[8]
	product.Temp=args[9]
	product.Price =args[10]
	product.Comment=args[11]

	productAsBytes, _ := json.Marshal(product)
	err = stub.PutState(product.Batchid, productAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}


	return shim.Success(nil)
}

//Change the Product by Batch ID
func (t *SimpleChaincode) move(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var err error
	var product Product
	bAsBytes, err := stub.GetState(args[0])

	err = json.Unmarshal(bAsBytes, &product)
	if err != nil {
		return shim.Error(err.Error())
	}
	
	product.Barcode=args[1]
	product.Manfdate=args[2]
	product.Expdate=args[3]
	
	//Commit updates batch to ledger
	btAsBytes, _ := json.Marshal(product)
	err = stub.PutState(product.Batchid, btAsBytes)	
	if err != nil {
		return shim.Error(err.Error())
	}	
	

        return shim.Success(nil);
}

//End of changing the Batch ID

// Query callback representing the query of a chaincode
func (t *SimpleChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var A string // Entities
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	A = args[0]

	// Get the state from the ledger
	Avalbytes, err := stub.GetState(A)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + A + "\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + A + "\"}"
		return shim.Error(jsonResp)
	}

//	jsonResp := "{\"Name\":\"" + A + "\",\"Amount\":\"" + string(Avalbytes) + "\"}"
//	logger.Infof("Query Response:%s\n", jsonResp)
	return shim.Success(Avalbytes)
}



// ============================================================================================================================


func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
