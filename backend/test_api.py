import urllib.request
import json

def test_endpoint(url, method='GET', data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        body = json.dumps(data).encode('utf-8')
    else:
        body = None
    with urllib.request.urlopen(req, data=body) as res:
        print(f"{method} {url} -> HTTP {res.status}")
        resp_data = res.read()
        content_type = res.headers.get('Content-Type', '')
        if 'application/json' in content_type:
            parsed = json.loads(resp_data.decode('utf-8'))
            sample = list(parsed.keys()) if isinstance(parsed, dict) else f"List({len(parsed)})"
            print(f"  Response sample: {sample}")
        else:
            print(f"  Response bytes: {len(resp_data)} bytes ({content_type})")

if __name__ == '__main__':
    print('--- Testing YieldVision API Endpoints ---')
    test_endpoint('http://127.0.0.1:8000/api/dashboard')
    test_endpoint('http://127.0.0.1:8000/api/models/performance')
    test_endpoint('http://127.0.0.1:8000/api/climate')
    test_endpoint('http://127.0.0.1:8000/api/climate/oni?start_year=2020&end_year=2026')
    test_endpoint('http://127.0.0.1:8000/api/predictions')

    # Test POST /api/predict
    predict_payload = {
        'crop': 'Sugarcane',
        'location': 'Maharashtra',
        'district': 'Kolhapur',
        'season': '2025-26',
        'year': 2025,
        'historical_yield': 7.45,
        'temperature': 28.4,
        'min_temp': 21.2,
        'max_temp': 34.6,
        'rainfall': 1120.0,
        'humidity': 68.0,
        'soil_moisture': 36.5,
        'soil_ph': 6.8,
        'nitrogen': 142.0,
        'phosphorus': 48.0,
        'potassium': 180.0,
        'oni_index': -0.35,
        'climate_state': 'Neutral'
    }
    test_endpoint('http://127.0.0.1:8000/api/predict', method='POST', data=predict_payload)

    # Test POST /api/scenario
    scenario_payload = {
        'baseline_input': predict_payload,
        'scenario_name': 'Test Drought Scenario',
        'rainfall': 700.0,
        'temperature': 33.0,
        'humidity': 50.0,
        'soil_moisture': 22.0,
        'nitrogen': 142.0,
        'phosphorus': 48.0,
        'potassium': 180.0,
        'oni_index': 1.2,
        'historical_yield': 7.45
    }
    test_endpoint('http://127.0.0.1:8000/api/scenario', method='POST', data=scenario_payload)

    # Test PDF report endpoint
    test_endpoint('http://127.0.0.1:8000/api/report/PRED-2025-001/pdf')

    # Test Sugarcane Trials Dataset (DATA-004) endpoints
    print('\n--- Testing Sugarcane Field Trials (DATA-004) Endpoints ---')
    test_endpoint('http://127.0.0.1:8000/api/datasets/sugarcane-trials')
    test_endpoint('http://127.0.0.1:8000/api/models/performance?dataset=DATA-004')
    
    trial_payload = {
        'rainfall_mm': 1450,
        'avg_temperature_celsius': 32.5,
        'sunlight_hours_per_day': 8.5,
        'nitrogen_n_kg_per_acre': 180,
        'phosphorus_p_kg_per_acre': 65,
        'potassium_k_kg_per_acre': 80,
        'soil_type': 'Alluvial',
        'crop_duration_days': 380,
        'irrigation_frequency_per_month': 3,
        'pest_control_applied': 1,
        'seed_variety': 'Co86032'
    }
    test_endpoint('http://127.0.0.1:8000/api/predict/sugarcane-trials', method='POST', data=trial_payload)

    print('\n>>> ALL 11 API INTEGRATION TESTS PASSED!')
