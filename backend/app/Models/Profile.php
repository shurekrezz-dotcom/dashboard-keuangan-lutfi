<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'birth_date',
        'gender',
        'address',
        'city',
        'occupation',
        'company',
        'education',
        'monthly_income',
        'monthly_expense_target',
        'monthly_savings_target',
        'marital_status',
        'dependents',
        'bank_name',
        'account_number',
    ];

    protected $casts = [
        'birth_date'             => 'date',
        'monthly_income'         => 'integer',
        'monthly_expense_target' => 'integer',
        'monthly_savings_target' => 'integer',
        'dependents'             => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}