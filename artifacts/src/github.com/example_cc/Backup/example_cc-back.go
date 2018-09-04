package main

import (
	"fmt"
//	"strconv"
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
	Status       string `json:"status"`
}



type AllBatches struct{
	AllBatches []string
}

type AllBatchesDetails struct{
	Batches []Product
}

//type TimeTracker struct{
//	DispachedTime	string
//	ReachedTime	string
//	TPTemprature	string
//}

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

	fmt.Println("chaincode_custom Init")
	var err error
	var batches AllBatches
	
	batchesAsBytes,_ :=json.Marshal(batches)
	err = stub.PutState("AllBatches", batchesAsBytes)
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
	if function == "transferProduct"{
		return t.transferProduct(stub,args)
	}
	if function == "getAllManuFacturerBatches"{
		return t.getAllManuFacturerBatches(stub, args)
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
	product.Status=args[12]

	productAsBytes, _ := json.Marshal(product)
	err = stub.PutState(product.Batchid, productAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
//update all batches to the array whose key is "AllBatches"
	AllBatchesAsBytes, err := stub.GetState("AllBatches")

	var allBatches AllBatches

	err= json.Unmarshal(AllBatchesAsBytes, &allBatches)
	allBatches.AllBatches=append(allBatches.AllBatches,product.Batchid)

	allbatchesAsBytes,_ :=json.Marshal(allBatches)
	err = stub.PutState("AllBatches", allbatchesAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
//-----------------------------------------------------------

	return shim.Success(nil)
}

//Change the Product by Batch ID
func (t *SimpleChaincode) transferProduct(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var err error
	var product Product
	bAsBytes, err := stub.GetState(args[0])

	err = json.Unmarshal(bAsBytes, &product)

	if err != nil {
		return shim.Error(err.Error())
	}
	
	product.Ownership=args[1]
	product.Status=args[2]
	
	//Commit updates batch to ledger
	btAsBytes, _ := json.Marshal(product)
	err = stub.PutState(product.Batchid, btAsBytes)	
	if err != nil {
		return shim.Error(err.Error())
	}	
	

        return shim.Success(nil);
}

// ============================================================================================================================
// Get All Batches Details for Transporter
// ============================================================================================================================
func (t *SimpleChaincode) getAllManuFacturerBatches(stub shim.ChaincodeStubInterface, args []string) pb.Response{
	
	//get the AllBatches index
	var owner string
	owner =args[0]
	fmt.Printf("Value of Owner: %s", owner)
	allBAsBytes,_ := stub.GetState("AllBatches")
	
	var res AllBatches
	json.Unmarshal(allBAsBytes, &res)
	
	var rab AllBatchesDetails

	for i := range res.AllBatches{

		sbAsBytes,_ := stub.GetState(res.AllBatches[i])
		
		var sb Product
		json.Unmarshal(sbAsBytes, &sb)

	if(sb.Ownership == owner) {
		fmt.Printf("Value of Owner-1: %s", sb.Ownership)
		rab.Batches = append(rab.Batches,sb); 
	}

	}

	rabAsBytes, _ := json.Marshal(rab)

	return shim.Success(rabAsBytes)
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
