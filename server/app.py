from flask import Flask,request,jsonify
from flask_pymongo import pymongo
from flask_cors import CORS
import pandas as pd
import csv

app=Flask(__name__)

MONGO_URI="mongodb+srv://saikaushiksadu:Kaushik97@cluster0.avfddoc.mongodb.net/"
client = pymongo.MongoClient(MONGO_URI)
db = client.get_database('flask_react')
user_collection = pymongo.collection.Collection(db, 'user_collection')

@app.route("/")
def index():
    return "Hello World, Welcome to FLASK"

CORS(app)

@app.route("/test")
def test():
    return "Connected to the data base!"

# used to send or get data from database
@app.route("/data",methods=['POST','GET'])
def data():
    if request.method=='POST':
        body=request.json
        population_male=body.get('population_male')
        population_female=body.get('population_female')
        literates_male=body.get('literates_male')
        literates_female=body.get('literates_female')
        state_name=body.get('state_name')

        db['data'].insert_one({
            "population_male":population_male,
            "population_female":population_female,
            "literates_male":literates_male,
            "literates_female":literates_female,
            "state_name":state_name
        })
        return jsonify({
            'status':'Data is posted to mongodb',
            'population_male':population_male,
            'population_female':population_female,
            'literates_male':literates_male,
            'literates_female':literates_female,
            'state_name':state_name
        })
    if request.method=='GET':
        alldata=db['result'].find()
        datajson=[]
        for data in alldata:
            population_male=data['population_male']
            population_female=data['population_female']
            literates_male=data['population_male']
            literates_female=data['population_female']
            state_name=data['state_name']
            total_population=data['total_population']
            total_literates=data['total_literates']
            sex_ratio=data['sex_ratio']
            
            dataDict={
                "population_male":population_male,
                "population_female":population_female,
                "literates_male":literates_male,
                "literates_female":literates_female,
                "state_name":state_name,
                "total_population":total_population,
                "total_literates":total_literates,
                "sex_ratio":sex_ratio,
            }
            datajson.append(dataDict)
        return jsonify(datajson)

# Upload the file from the frontend to backend and the upload function uploads the data to database
@app.route("/upload",methods=['POST'])
def upload():
    file = request.files['file']
    file.save('Population.csv')
    upload_data()
    return jsonify({'message': 'File uploaded successfully!'})

def upload_data():
    csvFile=open('Population.csv','r')
    reader=csv.DictReader(csvFile)
    header=['state_name','population_male','population_female','literates_male','literates_female']

    for each in reader:
        row={}
        for filed in header:
            row[filed]=each[filed]
        # print(row)
        db['data'].insert_one(row)
    return jsonify({'message':'Processed successfully!'})

#Retrieves the data from the original database and then gets the data performs some analysis and then again store them in to new collection.
@app.route("/process",methods=['POST'])
def process():
    data = db['data'].find()
    my_dataset=pd.DataFrame(data)
    my_dataset['total_population'] = my_dataset['population_male'].astype(int) + my_dataset['population_female'].astype(int)
    my_dataset['population_male'] = my_dataset['population_male'].astype(int) 
    my_dataset['population_female'] = my_dataset['population_female'].astype(int)
    my_dataset['literates_male'] = my_dataset['literates_male'].astype(int) 
    my_dataset['literates_female'] = my_dataset['literates_female'].astype(int)
    my_dataset['sex_ratio'] = my_dataset['population_male'].astype(int) / my_dataset['population_female'].astype(int)
    my_dataset['total_literates'] = my_dataset['literates_male'].astype(int) + my_dataset['literates_female'].astype(int)
    records = my_dataset.to_dict(orient="records")
    db['result'].insert_many(records)
    return jsonify({'message': 'Data processed and stored successfully!'})

# Directly converts csv file to dataframe and inserts into the mongo db database.
@app.route("/direct")
def direct():
    my_dataset=pd.read_csv("Population.csv")
    my_dataset['total_population'] = my_dataset['population_male'] + my_dataset['population_female'] 
    my_dataset['sex_ratio'] = my_dataset['population_male'] / my_dataset['population_female'] 
    my_dataset['total_literates'] = my_dataset['literates_male'] + my_dataset['literates_female'] 
    # total_grad=my_dataset['total_literates'].sum()
    # total_pop=my_dataset['total_population'].sum()
    # print(my_dataset)
    # print(f"Total population of India is {total_pop}")
    # print(f"Total graduates in India are {total_grad}")
    records = my_dataset.to_dict(orient="records")
    db['result'].insert_many(records)
    return jsonify({'message': 'Data processed and stored successfully!'})


if __name__ == '__main__':
    app.run(debug=True)