from django.contrib import admin

# Register your models here.


from .models import Employee, Department, DeptEmployee

admin.site.register(Employee)

admin.site.register(Department)