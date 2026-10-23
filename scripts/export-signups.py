"""Convert Wrangler D1 --json output to spreadsheet-safe CSV."""
import csv,json,sys
payload=json.load(sys.stdin)
rows=payload[0]['results']
writer=csv.writer(sys.stdout)
fields=['first_name','email','event','consent_version','created_at']
writer.writerow(fields)
for row in rows:
 values=[]
 for field in fields:
  value=str(row.get(field,''))
  values.append("'"+value if value.lstrip().startswith(('=','+','-','@')) else value)
 writer.writerow(values)
