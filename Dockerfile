#base image
FROM python:3.9

#WORKDIR
WORKDIR /real_estate_predictor

#COPY
COPY . /real_estate_predictor

#RUN
RUN pip install -r requirements.txt

#EXPOSE
EXPOSE 5000

#CMD
CMD [ "python","./app.py" ]