<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * GET /api/profile
     * Ambil profil user yang sedang login
     */
    public function show(Request $request)
    {
        $user    = $request->user();
        $profile = $user->profile;

        // Jika profil belum ada, buat yang kosong
        if (! $profile) {
            $profile = Profile::create(['user_id' => $user->id]);
        }

        return response()->json($this->formatResponse($user, $profile));
    }

    /**
     * PUT /api/profile
     * Simpan / update profil user yang sedang login
     */
    public function update(Request $request)
    {
        $request->validate([
            'name'                   => 'sometimes|string|max:100',
            'email'                  => 'sometimes|email|max:150|unique:users,email,' . $request->user()->id,
            'phone'                  => 'nullable|string|max:20',
            'birth_date'             => 'nullable|date',
            'gender'                 => 'nullable|in:Laki-laki,Perempuan',
            'address'                => 'nullable|string',
            'city'                   => 'nullable|string|max:100',
            'occupation'             => 'nullable|string|max:100',
            'company'                => 'nullable|string|max:150',
            'education'              => 'nullable|in:SD,SMP,SMA,D3,S1,S2,S3',
            'monthly_income'         => 'nullable|integer|min:0',
            'monthly_expense_target' => 'nullable|integer|min:0',
            'monthly_savings_target' => 'nullable|integer|min:0',
            'marital_status'         => 'nullable|in:Lajang,Menikah,Cerai',
            'dependents'             => 'nullable|integer|min:0',
            'bank_name'              => 'nullable|string|max:50',
            'account_number'         => 'nullable|string|max:50',
        ]);

        $user = $request->user();

        // Update nama & email di tabel users
        $user->update(array_filter([
            'name'  => $request->name,
            'email' => $request->email,
        ]));

        // Update atau buat profil
        $profile = $user->profile ?? new Profile(['user_id' => $user->id]);

        $profile->fill([
            'phone'                  => $request->phone,
            'birth_date'             => $request->birth_date,
            'gender'                 => $request->gender,
            'address'                => $request->address,
            'city'                   => $request->city,
            'occupation'             => $request->occupation,
            'company'                => $request->company,
            'education'              => $request->education,
            'monthly_income'         => $request->monthly_income ?? 0,
            'monthly_expense_target' => $request->monthly_expense_target ?? 0,
            'monthly_savings_target' => $request->monthly_savings_target ?? 0,
            'marital_status'         => $request->marital_status,
            'dependents'             => $request->dependents ?? 0,
            'bank_name'              => $request->bank_name,
            'account_number'         => $request->account_number,
        ]);

        $profile->save();

        // Refresh user agar nama/email terbaru
        $user->refresh();

        return response()->json($this->formatResponse($user, $profile));
    }

    /**
     * Format response agar field-nya konsisten dengan yang diharapkan frontend
     */
    private function formatResponse($user, $profile): array
    {
        return [
            // Dari tabel users
            'name'                   => $user->name,
            'email'                  => $user->email,

            // Dari tabel profiles
            'phone'                  => $profile->phone,
            'birth_date'             => $profile->birth_date
                                            ? $profile->birth_date->format('Y-m-d')
                                            : null,
            'gender'                 => $profile->gender,
            'address'                => $profile->address,
            'city'                   => $profile->city,
            'occupation'             => $profile->occupation,
            'company'                => $profile->company,
            'education'              => $profile->education,
            'monthly_income'         => $profile->monthly_income ?? 0,
            'monthly_expense_target' => $profile->monthly_expense_target ?? 0,
            'monthly_savings_target' => $profile->monthly_savings_target ?? 0,
            'marital_status'         => $profile->marital_status,
            'dependents'             => $profile->dependents ?? 0,
            'bank_name'              => $profile->bank_name,
            'account_number'         => $profile->account_number,
        ];
    }
}