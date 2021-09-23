from django.db import models

# Create your models here.



class temp(models.Model):
    temp = models.CharField(max_length=10)



class Employee(models.Model):
    id = models.PositiveBigIntegerField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    dob = models.DateField()
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.first_name + self.last_name


class Department(models.Model):
    id = models.PositiveBigIntegerField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class DeptEmployee(models.Model):
    emp_id = models.ForeignKey(Employee, on_delete=models.CASCADE)
    dept_id = models.ForeignKey(Department, on_delete=models.CASCADE)










