package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	//	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type Employee struct {
	Empid         string `json:"empid"`
	Name          string `json:"name"`
	Dob           string `json:"dob"`
	Gender        string `json:"gender"`
	Nationality   string `json:"nationality"`
	Doj           string `json:"doj"`
	Designation   string `json:"designation"`
	Division      string `json:"division"`
	Boeingsub     string `json:"boeingsub"`
	Certification string `json:"certification"`
	Certdate      string `json:"certdate"`
	Yearofexp     string `json:"yearofexp"`
	Status        string `json:"status"`
	Certipath     string `json:"certipath"`
	Certihash     string `json:"certihash"`
}

type AllEmployees struct {
	AllEmployees []string
}

type AllEmployeesDetails struct {
	Employees []Employee
}

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

	fmt.Println("chaincode_custom Init")
	var err error
	var employees AllEmployees

	employeesAsBytes, _ := json.Marshal(employees)
	err = stub.PutState("AllEmployees", employeesAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("chaincode_custom Invoke")
	function, args := stub.GetFunctionAndParameters()

	if function == "onboard" {
		return t.onboard(stub, args)
	}
	if function == "transfer" {
		return t.transfer(stub, args)
	}
	if function == "update" {
		return t.update(stub, args)
	}
	if function == "getAllSubsidEmployees" {
		return t.getAllSubsidEmployees(stub, args)
	}
	if function == "getAllEmployees" {
		return t.getAllEmployees(stub, args)
	}
	if function == "query" {
		// queries an entity state
		return t.query(stub, args)
	}
	if function == "getemployeehistory" {
		// queries an entity state
		fmt.Println("chaincode getemployeehistory")
		return t.getemployeehistory(stub, args)
	}

	return shim.Error("Invalid invoke function name.")
}

//func to onboard Employee
func (t *SimpleChaincode) onboard(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("Employee Onboarding...")
	var employee Employee
	var err error

	isExistAsBytes, _ := stub.GetState(args[0])

	if isExistAsBytes != nil {
		return shim.Error(err.Error())
	}

	employee.Empid = args[0]
	employee.Name = args[1]
	employee.Dob = args[2]
	employee.Gender = args[3]
	employee.Nationality = args[4]
	employee.Doj = args[5]
	employee.Designation = args[6]
	employee.Division = args[7]
	employee.Boeingsub = args[8]
	employee.Certification = args[9]
	employee.Certdate = args[10]
	employee.Yearofexp = args[11]
	employee.Status = args[12]
	employee.Certipath = args[13]
	employee.Certihash = args[14]

	employeeAsBytes, _ := json.Marshal(employee)
	err = stub.PutState(employee.Empid, employeeAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//update all employees to the array whose key is "AllEmployees"
	AllEmployeesAsBytes, err := stub.GetState("AllEmployees")

	var allEmployees AllEmployees

	err = json.Unmarshal(AllEmployeesAsBytes, &allEmployees)
	allEmployees.AllEmployees = append(allEmployees.AllEmployees, employee.Empid)

	allemployeesAsBytes, _ := json.Marshal(allEmployees)
	err = stub.PutState("AllEmployees", allemployeesAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//-----------------------------------------------------------

	return shim.Success(nil)
}

//Transfer the employee from on Boeing subsidiary to other subsidiary
func (t *SimpleChaincode) transfer(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var err error
	var employee Employee
	bAsBytes, err := stub.GetState(args[0])

	err = json.Unmarshal(bAsBytes, &employee)

	if err != nil {
		return shim.Error(err.Error())
	}

	employee.Boeingsub = args[1]
	employee.Status = args[2]

	//Commit updates batch to ledger
	btAsBytes, _ := json.Marshal(employee)
	err = stub.PutState(employee.Empid, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Transfer the employee from on Boeing subsidiary to other subsidiary
func (t *SimpleChaincode) update(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var err error
	var employee Employee
	bAsBytes, err := stub.GetState(args[0])

	err = json.Unmarshal(bAsBytes, &employee)

	if err != nil {
		return shim.Error(err.Error())
	}

	employee.Certification = args[1]
	employee.Certdate = args[2]

	//Commit updates batch to ledger
	btAsBytes, _ := json.Marshal(employee)
	err = stub.PutState(employee.Empid, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Batches Details for Transporter
// ============================================================================================================================
func (t *SimpleChaincode) getAllSubsidEmployees(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//get the AllBatches index
	var subsidiary string
	subsidiary = args[0]
	fmt.Printf("Value of Subsidiary: %s", subsidiary)
	allBAsBytes, _ := stub.GetState("AllEmployees")

	var res AllEmployees
	json.Unmarshal(allBAsBytes, &res)

	var rab AllEmployeesDetails

	for i := range res.AllEmployees {

		sbAsBytes, _ := stub.GetState(res.AllEmployees[i])

		var sb Employee
		json.Unmarshal(sbAsBytes, &sb)

		if sb.Boeingsub == subsidiary {
			fmt.Printf("Value of Owner-1: %s", sb.Boeingsub)
			rab.Employees = append(rab.Employees, sb)
		}

	}

	rabAsBytes, _ := json.Marshal(rab)

	return shim.Success(rabAsBytes)
}

// ============================================================================================================================
// Get All Details for Employees
// ============================================================================================================================
func (t *SimpleChaincode) getAllEmployees(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//get the AllBatches index
	var subsidiary string
	subsidiary = args[0]
	fmt.Printf("Value of Subsidiary: %s", subsidiary)
	allBAsBytes, _ := stub.GetState("AllEmployees")

	var res AllEmployees
	json.Unmarshal(allBAsBytes, &res)

	var rab AllEmployeesDetails

	for i := range res.AllEmployees {

		sbAsBytes, _ := stub.GetState(res.AllEmployees[i])

		var sb Employee
		json.Unmarshal(sbAsBytes, &sb)

		//if sb.Boeingsub == subsidiary {
		fmt.Printf("Value of Owner-1: %s", sb.Boeingsub)
		rab.Employees = append(rab.Employees, sb)
		//	}

	}

	rabAsBytes, _ := json.Marshal(rab)

	return shim.Success(rabAsBytes)
}

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

//Query to get the history of the Employee

func (t *SimpleChaincode) getemployeehistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	fmt.Printf("In getemployeehistory Function")

	if len(args) < 1 {
		fmt.Printf("In getemployeehistory Error Function")
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	Empid := args[0]

	fmt.Printf("- start getHistoryForEmployee: %s\n", Empid)

	resultsIterator, err := stub.GetHistoryForKey(Empid)

	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the marble
	var buffer bytes.Buffer

	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON marble)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForEmployee returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// ============================================================================================================================

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
